var Co=Object.defineProperty;var So=Object.getOwnPropertyDescriptor;var A=(e,t,n,i)=>{for(var a=i>1?void 0:i?So(t,n):t,r=e.length-1,o;r>=0;r--)(o=e[r])&&(a=(i?o(t,n,a):o(a))||a);return i&&a&&Co(t,n,a),a};var zt=globalThis,_t=zt.ShadowRoot&&(zt.ShadyCSS===void 0||zt.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,$n=Symbol(),Li=new WeakMap,pt=class{constructor(t,n,i){if(this._$cssResult$=!0,i!==$n)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=n}get styleSheet(){let t=this.o,n=this.t;if(_t&&t===void 0){let i=n!==void 0&&n.length===1;i&&(t=Li.get(n)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),i&&Li.set(n,t))}return t}toString(){return this.cssText}},oe=e=>new pt(typeof e=="string"?e:e+"",void 0,$n),kn=(e,...t)=>{let n=e.length===1?e[0]:t.reduce((i,a,r)=>i+(o=>{if(o._$cssResult$===!0)return o.cssText;if(typeof o=="number")return o;throw Error("Value passed to 'css' function must be a 'css' function result: "+o+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(a)+e[r+1],e[0]);return new pt(n,e,$n)},zi=(e,t)=>{if(_t)e.adoptedStyleSheets=t.map(n=>n instanceof CSSStyleSheet?n:n.styleSheet);else for(let n of t){let i=document.createElement("style"),a=zt.litNonce;a!==void 0&&i.setAttribute("nonce",a),i.textContent=n.cssText,e.appendChild(i)}},Cn=_t?e=>e:e=>e instanceof CSSStyleSheet?(t=>{let n="";for(let i of t.cssRules)n+=i.cssText;return oe(n)})(e):e;var{is:Eo,defineProperty:To,getOwnPropertyDescriptor:Fo,getOwnPropertyNames:Ro,getOwnPropertySymbols:Io,getPrototypeOf:Ao}=Object,Ht=globalThis,_i=Ht.trustedTypes,Mo=_i?_i.emptyScript:"",Lo=Ht.reactiveElementPolyfillSupport,ut=(e,t)=>e,ht={toAttribute(e,t){switch(t){case Boolean:e=e?Mo:null;break;case Object:case Array:e=e==null?e:JSON.stringify(e)}return e},fromAttribute(e,t){let n=e;switch(t){case Boolean:n=e!==null;break;case Number:n=e===null?null:Number(e);break;case Object:case Array:try{n=JSON.parse(e)}catch{n=null}}return n}},Pt=(e,t)=>!Eo(e,t),Hi={attribute:!0,type:String,converter:ht,reflect:!1,useDefault:!1,hasChanged:Pt};Symbol.metadata??=Symbol("metadata"),Ht.litPropertyMetadata??=new WeakMap;var Se=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,n=Hi){if(n.state&&(n.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((n=Object.create(n)).wrapped=!0),this.elementProperties.set(t,n),!n.noAccessor){let i=Symbol(),a=this.getPropertyDescriptor(t,i,n);a!==void 0&&To(this.prototype,t,a)}}static getPropertyDescriptor(t,n,i){let{get:a,set:r}=Fo(this.prototype,t)??{get(){return this[n]},set(o){this[n]=o}};return{get:a,set(o){let l=a?.call(this);r?.call(this,o),this.requestUpdate(t,l,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??Hi}static _$Ei(){if(this.hasOwnProperty(ut("elementProperties")))return;let t=Ao(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(ut("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(ut("properties"))){let n=this.properties,i=[...Ro(n),...Io(n)];for(let a of i)this.createProperty(a,n[a])}let t=this[Symbol.metadata];if(t!==null){let n=litPropertyMetadata.get(t);if(n!==void 0)for(let[i,a]of n)this.elementProperties.set(i,a)}this._$Eh=new Map;for(let[n,i]of this.elementProperties){let a=this._$Eu(n,i);a!==void 0&&this._$Eh.set(a,n)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){let n=[];if(Array.isArray(t)){let i=new Set(t.flat(1/0).reverse());for(let a of i)n.unshift(Cn(a))}else t!==void 0&&n.push(Cn(t));return n}static _$Eu(t,n){let i=n.attribute;return i===!1?void 0:typeof i=="string"?i:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),this.renderRoot!==void 0&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){let t=new Map,n=this.constructor.elementProperties;for(let i of n.keys())this.hasOwnProperty(i)&&(t.set(i,this[i]),delete this[i]);t.size>0&&(this._$Ep=t)}createRenderRoot(){let t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return zi(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,n,i){this._$AK(t,i)}_$ET(t,n){let i=this.constructor.elementProperties.get(t),a=this.constructor._$Eu(t,i);if(a!==void 0&&i.reflect===!0){let r=(i.converter?.toAttribute!==void 0?i.converter:ht).toAttribute(n,i.type);this._$Em=t,r==null?this.removeAttribute(a):this.setAttribute(a,r),this._$Em=null}}_$AK(t,n){let i=this.constructor,a=i._$Eh.get(t);if(a!==void 0&&this._$Em!==a){let r=i.getPropertyOptions(a),o=typeof r.converter=="function"?{fromAttribute:r.converter}:r.converter?.fromAttribute!==void 0?r.converter:ht;this._$Em=a;let l=o.fromAttribute(n,r.type);this[a]=l??this._$Ej?.get(a)??l,this._$Em=null}}requestUpdate(t,n,i,a=!1,r){if(t!==void 0){let o=this.constructor;if(a===!1&&(r=this[t]),i??=o.getPropertyOptions(t),!((i.hasChanged??Pt)(r,n)||i.useDefault&&i.reflect&&r===this._$Ej?.get(t)&&!this.hasAttribute(o._$Eu(t,i))))return;this.C(t,n,i)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(t,n,{useDefault:i,reflect:a,wrapped:r},o){i&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,o??n??this[t]),r!==!0||o!==void 0)||(this._$AL.has(t)||(this.hasUpdated||i||(n=void 0),this._$AL.set(t,n)),a===!0&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(n){Promise.reject(n)}let t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[a,r]of this._$Ep)this[a]=r;this._$Ep=void 0}let i=this.constructor.elementProperties;if(i.size>0)for(let[a,r]of i){let{wrapped:o}=r,l=this[a];o!==!0||this._$AL.has(a)||l===void 0||this.C(a,void 0,r,l)}}let t=!1,n=this._$AL;try{t=this.shouldUpdate(n),t?(this.willUpdate(n),this._$EO?.forEach(i=>i.hostUpdate?.()),this.update(n)):this._$EM()}catch(i){throw t=!1,this._$EM(),i}t&&this._$AE(n)}willUpdate(t){}_$AE(t){this._$EO?.forEach(n=>n.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(n=>this._$ET(n,this[n])),this._$EM()}updated(t){}firstUpdated(t){}};Se.elementStyles=[],Se.shadowRootOptions={mode:"open"},Se[ut("elementProperties")]=new Map,Se[ut("finalized")]=new Map,Lo?.({ReactiveElement:Se}),(Ht.reactiveElementVersions??=[]).push("2.1.2");var An=globalThis,Pi=e=>e,Nt=An.trustedTypes,Ni=Nt?Nt.createPolicy("lit-html",{createHTML:e=>e}):void 0,Ui="$lit$",Ie=`lit$${Math.random().toFixed(9).slice(2)}$`,Ki="?"+Ie,zo=`<${Ki}>`,Ve=document,ft=()=>Ve.createComment(""),gt=e=>e===null||typeof e!="object"&&typeof e!="function",Mn=Array.isArray,_o=e=>Mn(e)||typeof e?.[Symbol.iterator]=="function",Sn=`[ 	
\f\r]`,mt=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,Oi=/-->/g,Vi=/>/g,Ne=RegExp(`>|${Sn}(?:([^\\s"'>=/]+)(${Sn}*=${Sn}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),Di=/'/g,Bi=/"/g,Wi=/^(?:script|style|textarea|title)$/i,Ln=e=>(t,...n)=>({_$litType$:e,strings:t,values:n}),u=Ln(1),k=Ln(2),Md=Ln(3),De=Symbol.for("lit-noChange"),m=Symbol.for("lit-nothing"),Gi=new WeakMap,Oe=Ve.createTreeWalker(Ve,129);function ji(e,t){if(!Mn(e)||!e.hasOwnProperty("raw"))throw Error("invalid template strings array");return Ni!==void 0?Ni.createHTML(t):t}var Ho=(e,t)=>{let n=e.length-1,i=[],a,r=t===2?"<svg>":t===3?"<math>":"",o=mt;for(let l=0;l<n;l++){let s=e[l],d,c,p=-1,h=0;for(;h<s.length&&(o.lastIndex=h,c=o.exec(s),c!==null);)h=o.lastIndex,o===mt?c[1]==="!--"?o=Oi:c[1]!==void 0?o=Vi:c[2]!==void 0?(Wi.test(c[2])&&(a=RegExp("</"+c[2],"g")),o=Ne):c[3]!==void 0&&(o=Ne):o===Ne?c[0]===">"?(o=a??mt,p=-1):c[1]===void 0?p=-2:(p=o.lastIndex-c[2].length,d=c[1],o=c[3]===void 0?Ne:c[3]==='"'?Bi:Di):o===Bi||o===Di?o=Ne:o===Oi||o===Vi?o=mt:(o=Ne,a=void 0);let y=o===Ne&&e[l+1].startsWith("/>")?" ":"";r+=o===mt?s+zo:p>=0?(i.push(d),s.slice(0,p)+Ui+s.slice(p)+Ie+y):s+Ie+(p===-2?l:y)}return[ji(e,r+(e[n]||"<?>")+(t===2?"</svg>":t===3?"</math>":"")),i]},yt=class e{constructor({strings:t,_$litType$:n},i){let a;this.parts=[];let r=0,o=0,l=t.length-1,s=this.parts,[d,c]=Ho(t,n);if(this.el=e.createElement(d,i),Oe.currentNode=this.el.content,n===2||n===3){let p=this.el.content.firstChild;p.replaceWith(...p.childNodes)}for(;(a=Oe.nextNode())!==null&&s.length<l;){if(a.nodeType===1){if(a.hasAttributes())for(let p of a.getAttributeNames())if(p.endsWith(Ui)){let h=c[o++],y=a.getAttribute(p).split(Ie),g=/([.?@])?(.*)/.exec(h);s.push({type:1,index:r,name:g[2],strings:y,ctor:g[1]==="."?Tn:g[1]==="?"?Fn:g[1]==="@"?Rn:Qe}),a.removeAttribute(p)}else p.startsWith(Ie)&&(s.push({type:6,index:r}),a.removeAttribute(p));if(Wi.test(a.tagName)){let p=a.textContent.split(Ie),h=p.length-1;if(h>0){a.textContent=Nt?Nt.emptyScript:"";for(let y=0;y<h;y++)a.append(p[y],ft()),Oe.nextNode(),s.push({type:2,index:++r});a.append(p[h],ft())}}}else if(a.nodeType===8)if(a.data===Ki)s.push({type:2,index:r});else{let p=-1;for(;(p=a.data.indexOf(Ie,p+1))!==-1;)s.push({type:7,index:r}),p+=Ie.length-1}r++}}static createElement(t,n){let i=Ve.createElement("template");return i.innerHTML=t,i}};function Ze(e,t,n=e,i){if(t===De)return t;let a=i!==void 0?n._$Co?.[i]:n._$Cl,r=gt(t)?void 0:t._$litDirective$;return a?.constructor!==r&&(a?._$AO?.(!1),r===void 0?a=void 0:(a=new r(e),a._$AT(e,n,i)),i!==void 0?(n._$Co??=[])[i]=a:n._$Cl=a),a!==void 0&&(t=Ze(e,a._$AS(e,t.values),a,i)),t}var En=class{constructor(t,n){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=n}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){let{el:{content:n},parts:i}=this._$AD,a=(t?.creationScope??Ve).importNode(n,!0);Oe.currentNode=a;let r=Oe.nextNode(),o=0,l=0,s=i[0];for(;s!==void 0;){if(o===s.index){let d;s.type===2?d=new vt(r,r.nextSibling,this,t):s.type===1?d=new s.ctor(r,s.name,s.strings,this,t):s.type===6&&(d=new In(r,this,t)),this._$AV.push(d),s=i[++l]}o!==s?.index&&(r=Oe.nextNode(),o++)}return Oe.currentNode=Ve,a}p(t){let n=0;for(let i of this._$AV)i!==void 0&&(i.strings!==void 0?(i._$AI(t,i,n),n+=i.strings.length-2):i._$AI(t[n])),n++}},vt=class e{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,n,i,a){this.type=2,this._$AH=m,this._$AN=void 0,this._$AA=t,this._$AB=n,this._$AM=i,this.options=a,this._$Cv=a?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode,n=this._$AM;return n!==void 0&&t?.nodeType===11&&(t=n.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,n=this){t=Ze(this,t,n),gt(t)?t===m||t==null||t===""?(this._$AH!==m&&this._$AR(),this._$AH=m):t!==this._$AH&&t!==De&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):_o(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==m&&gt(this._$AH)?this._$AA.nextSibling.data=t:this.T(Ve.createTextNode(t)),this._$AH=t}$(t){let{values:n,_$litType$:i}=t,a=typeof i=="number"?this._$AC(t):(i.el===void 0&&(i.el=yt.createElement(ji(i.h,i.h[0]),this.options)),i);if(this._$AH?._$AD===a)this._$AH.p(n);else{let r=new En(a,this),o=r.u(this.options);r.p(n),this.T(o),this._$AH=r}}_$AC(t){let n=Gi.get(t.strings);return n===void 0&&Gi.set(t.strings,n=new yt(t)),n}k(t){Mn(this._$AH)||(this._$AH=[],this._$AR());let n=this._$AH,i,a=0;for(let r of t)a===n.length?n.push(i=new e(this.O(ft()),this.O(ft()),this,this.options)):i=n[a],i._$AI(r),a++;a<n.length&&(this._$AR(i&&i._$AB.nextSibling,a),n.length=a)}_$AR(t=this._$AA.nextSibling,n){for(this._$AP?.(!1,!0,n);t!==this._$AB;){let i=Pi(t).nextSibling;Pi(t).remove(),t=i}}setConnected(t){this._$AM===void 0&&(this._$Cv=t,this._$AP?.(t))}},Qe=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,n,i,a,r){this.type=1,this._$AH=m,this._$AN=void 0,this.element=t,this.name=n,this._$AM=a,this.options=r,i.length>2||i[0]!==""||i[1]!==""?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=m}_$AI(t,n=this,i,a){let r=this.strings,o=!1;if(r===void 0)t=Ze(this,t,n,0),o=!gt(t)||t!==this._$AH&&t!==De,o&&(this._$AH=t);else{let l=t,s,d;for(t=r[0],s=0;s<r.length-1;s++)d=Ze(this,l[i+s],n,s),d===De&&(d=this._$AH[s]),o||=!gt(d)||d!==this._$AH[s],d===m?t=m:t!==m&&(t+=(d??"")+r[s+1]),this._$AH[s]=d}o&&!a&&this.j(t)}j(t){t===m?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}},Tn=class extends Qe{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===m?void 0:t}},Fn=class extends Qe{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==m)}},Rn=class extends Qe{constructor(t,n,i,a,r){super(t,n,i,a,r),this.type=5}_$AI(t,n=this){if((t=Ze(this,t,n,0)??m)===De)return;let i=this._$AH,a=t===m&&i!==m||t.capture!==i.capture||t.once!==i.once||t.passive!==i.passive,r=t!==m&&(i===m||a);a&&this.element.removeEventListener(this.name,this,i),r&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}},In=class{constructor(t,n,i){this.element=t,this.type=6,this._$AN=void 0,this._$AM=n,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(t){Ze(this,t)}};var Po=An.litHtmlPolyfillSupport;Po?.(yt,vt),(An.litHtmlVersions??=[]).push("3.3.3");var qi=(e,t,n)=>{let i=n?.renderBefore??t,a=i._$litPart$;if(a===void 0){let r=n?.renderBefore??null;i._$litPart$=a=new vt(t.insertBefore(ft(),r),r,void 0,n??{})}return a._$AI(e),a};var zn=globalThis,Ae=class extends Se{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){let n=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=qi(n,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return De}};Ae._$litElement$=!0,Ae.finalized=!0,zn.litElementHydrateSupport?.({LitElement:Ae});var No=zn.litElementPolyfillSupport;No?.({LitElement:Ae});(zn.litElementVersions??=[]).push("4.2.2");var Oo={attribute:!0,type:String,converter:ht,reflect:!1,hasChanged:Pt},Vo=(e=Oo,t,n)=>{let{kind:i,metadata:a}=n,r=globalThis.litPropertyMetadata.get(a);if(r===void 0&&globalThis.litPropertyMetadata.set(a,r=new Map),i==="setter"&&((e=Object.create(e)).wrapped=!0),r.set(n.name,e),i==="accessor"){let{name:o}=n;return{set(l){let s=t.get.call(this);t.set.call(this,l),this.requestUpdate(o,s,e,!0,l)},init(l){return l!==void 0&&this.C(o,void 0,e,l),l}}}if(i==="setter"){let{name:o}=n;return function(l){let s=this[o];t.call(this,l),this.requestUpdate(o,s,e,!0,l)}}throw Error("Unsupported decorator location: "+i)};function et(e){return(t,n)=>typeof n=="object"?Vo(e,t,n):((i,a,r)=>{let o=a.hasOwnProperty(r);return a.constructor.createProperty(r,i),o?Object.getOwnPropertyDescriptor(a,r):void 0})(e,t,n)}function L(e){return et({...e,state:!0,attribute:!1})}var Me="wrist_assistant/complications";async function Yi(e){return e.connection.sendMessagePromise({type:`${Me}/owners`})}async function Ji(e,t){return e.connection.sendMessagePromise({type:`${Me}/list`,owner_watch_id:t})}async function Xi(e,t){return e.connection.sendMessagePromise({type:`${Me}/nudge`,owner_watch_id:t})}async function Zi(e,t,n,i){return e.connection.sendMessagePromise({type:`${Me}/save`,owner_watch_id:t,document:n,base_revision:i})}async function Qi(e,t,n,i){return e.connection.sendMessagePromise({type:`${Me}/delete`,owner_watch_id:t,complication_id:n,base_revision:i})}async function ea(e,t,n){return e.connection.sendMessagePromise({type:`${Me}/move_owner`,source_owner_watch_id:t,target_owner_watch_id:n})}function ta(e,t,n){let i={type:`${Me}/subscribe`};return t&&(i.owner_watch_id=t),e.connection.subscribeMessage(n,i)}async function na(e,t){return Object.keys(t).length===0?{}:(await e.connection.sendMessagePromise({type:`${Me}/render_values`,templates:t})).results}var X=["rectangular","circular","corner"],ge={rectangular:{width:181,height:65.5},circular:{width:51,height:51},corner:{width:34,height:34}},Do=["rectangular","circular","corner","inline"];var Hn=64;function pa(e,t){let n=new Set(e);for(let i of t)n.add(i.slot);for(let i=0;i<Hn;i++)if(!n.has(i))return i;return-1}function wt(e){return X.some(n=>!e.supportedFamilies.includes(n))||e.supportedFamilies.includes("inline")||e.inline!==void 0?6:e.slotIndex>7?5:4}var ua={x:.25,y:.25,width:.5,height:.5,rotationDegrees:0},le={setColor:"color",setOpacity:"opacity",setText:"text",setIcon:"icon",setFontSize:"fontSize",setFontWeight:"fontWeight",setRotation:"rotation",hide:"visibility",show:"visibility",setGaugeValue:"gaugeValue",setGaugeMin:"gaugeMin",setGaugeMax:"gaugeMax",setBorderColor:"borderColor",setBorderWidth:"borderWidth",setBackgroundColor:"backgroundColor"},xt=6,$t=9,Bo=["topLeading","topTrailing","bottomLeading","bottomTrailing"];function Ee(e){return Number.isFinite(e.timestampX)&&Number.isFinite(e.timestampY)}function Pn(e,t){let n=t<=.5,i=e<=.5;return n?i?"topLeading":"topTrailing":i?"bottomLeading":"bottomTrailing"}var Nn={top:0,left:0,bottom:0,right:0};function Gt(e){return e===void 0||e.top===0&&e.left===0&&e.bottom===0&&e.right===0}var On=[["refresh","Refresh"],["none","Nothing"],["openApp","Open the app"],["openPage","Open the page"],["openRoomPage","Open the room page"],["timerStartPause","Timer start / pause"],["timerCancel","Timer cancel"],["toggleEntity","Toggle an entity"],["runScene","Run a scene"],["runScript","Run a script"],["addTodo","Add a to-do"],["runHTTPAction","Run an HTTP action"]];function Te(e){let t=On.find(([i])=>i===e.type)?.[1]??e.type;if(!("entityId"in e))return t;let n=e.displayName||e.entityId;return n?`${t}: ${n}`:t}function S(e){return typeof e=="object"&&e!==null&&!Array.isArray(e)}function K(e,t=""){return typeof e=="string"?e:t}function G(e,t){return typeof e=="number"?e:e==="+inf"?1/0:e==="-inf"?-1/0:e==="nan"?NaN:t}function we(e){return Number.isFinite(e)?Math.min(1,Math.max(0,e)):0}function Bt(e){return e==null?void 0:G(e,0)}function bt(e){return typeof e=="string"?e:void 0}var xe=class extends Error{};function Be(e){if(typeof e.entityId!="string")throw new xe("entityId is required");let t={entityId:e.entityId,displayName:K(e.displayName),domain:K(e.domain)};return typeof e.iconName=="string"&&(t.iconName=e.iconName),t}function ia(e){if(!S(e))return;let t={};return e.decimals!==void 0&&e.decimals!==null&&(t.decimals=G(e.decimals,0)),e.multiply!==void 0&&e.multiply!==null&&(t.multiply=G(e.multiply,1)),e.offset!==void 0&&e.offset!==null&&(t.offset=G(e.offset,0)),typeof e.prefix=="string"&&(t.prefix=e.prefix),typeof e.suffix=="string"&&(t.suffix=e.suffix),e.useEntityUnit===!0&&(t.useEntityUnit=!0),e.relativeTime===!0&&(t.relativeTime=!0),(e.textCase==="upper"||e.textCase==="lower"||e.textCase==="capitalized")&&(t.textCase=e.textCase),$e(t)?void 0:t}function $e(e){return e?e.decimals===void 0&&e.multiply===void 0&&e.offset===void 0&&!e.prefix&&!e.suffix&&!e.useEntityUnit&&!e.relativeTime&&e.textCase===void 0:!0}function Go(e){let t=K(e.function,"count"),n=S(e.scope)?e.scope:{},i;if(n.kind==="entities")i={kind:"entities",entities:(Array.isArray(n.entities)?n.entities:[]).filter(S).map(Be)};else{let r=o=>Array.isArray(o)?o.filter(l=>typeof l=="string"):[];i={kind:"filter",domains:r(n.domains),areaIds:r(n.areaIds),labelIds:r(n.labelIds),floorIds:r(n.floorIds)}}let a={function:t,scope:i};if(S(e.stateFilter)){let r=e.stateFilter.kind;r==="isOn"||r==="isOff"?a.stateFilter={kind:r}:(r==="equals"||r==="notEquals")&&(a.stateFilter={kind:r,value:K(e.stateFilter.value)})}return typeof e.attribute=="string"&&(a.attribute=e.attribute),a}function aa(e){switch(e.kind){case"literal":return{kind:"literal",value:K(e.value)};case"entityState":return{kind:"entityState",...Be(e)};case"entityAttribute":return{kind:"entityAttribute",...Be(e),attribute:K(e.attribute)};case"entityAge":return{kind:"entityAge",...Be(e)};case"aggregate":return{kind:"aggregate",aggregate:Go(S(e.aggregate)?e.aggregate:{})};case"time":return{kind:"time",timeField:bt(e.timeField)??"now"};case"dataAge":return{kind:"dataAge"};case"jinja":return{kind:"jinja",value:K(e.value)};case"named":return{kind:"named",id:K(e.id).toUpperCase()};default:throw new xe(`unknown value kind ${String(e.kind)}`)}}function ne(e){if(!S(e))throw new xe("value must be an object");if(S(e.kind)){let i={kind:aa(e.kind)},a=ia(e.format);return a&&(i.format=a),i}let t={kind:aa(e)},n=ia(e.format);return n&&(t.format=n),t}function ha(e){return S(e)?{x:G(e.x,.25),y:G(e.y,.25),width:G(e.width,.5),height:G(e.height,.5),rotationDegrees:G(e.rotationDegrees,0)}:{...ua}}function Uo(e){if(!S(e))return{kind:"isOn"};let t=K(e.kind,"isOn"),n={kind:t};switch(t){case"equals":case"notEquals":case"greaterThan":case"greaterOrEqual":case"lessThan":case"lessOrEqual":case"contains":case"startsWith":case"endsWith":n.value=S(e.value)?ne(e.value):E("");break;case"between":n.value=S(e.value)?ne(e.value):E(""),n.upper=S(e.upper)?ne(e.upper):E("");break;case"matchesRegex":n.pattern=K(e.pattern);break;case"isOneOf":n.options=Array.isArray(e.options)?e.options.filter(i=>typeof i=="string"):[];break;default:break}return n}function ra(e){if(!S(e))return{kind:"show"};let t=K(e.kind,"show"),n={kind:t};switch(t){case"setColor":case"setText":case"setIcon":case"setGaugeValue":case"setBorderColor":case"setBackgroundColor":n.value=S(e.value)?ne(e.value):E("");break;case"setOpacity":case"setFontSize":case"setRotation":case"setGaugeMin":case"setGaugeMax":case"setBorderWidth":n.number=G(e.number,0);break;case"setFontWeight":n.weight=bt(e.weight)??"regular";break;default:break}return n}function ma(e){return Array.isArray(e)?e.filter(S).map(t=>{let n={id:K(t.id).toUpperCase(),cases:(Array.isArray(t.cases)?t.cases:[]).filter(S).map(i=>{let a=S(i.when)?i.when:{};return{id:K(i.id).toUpperCase(),when:{join:a.join==="any"?"any":"all",tests:(Array.isArray(a.tests)?a.tests:[]).filter(S).map(r=>({id:K(r.id).toUpperCase(),value:S(r.value)?ne(r.value):E(""),comparison:Uo(r.comparison)}))},then:(Array.isArray(i.then)?i.then:[]).map(ra)}})};return Array.isArray(t.otherwise)&&(n.otherwise=t.otherwise.map(ra)),n}):[]}function Ko(e,t){return{baseColorHex:S(e)?K(e.baseColorHex,t):t}}function tt(e,t){if(typeof e.id!="string")throw new xe("element id is required");return{id:e.id.toUpperCase(),colorSlot:Ko(e.colorSlot,t),rules:ma(e.rules),frame:ha(e.frame),isHidden:e.isHidden===!0}}function Wo(e){let t=jo(e),n=e.payload;return typeof n.groupId=="string"&&n.groupId!==""&&(t.payload.groupId=n.groupId.toUpperCase()),t}function jo(e){if(!S(e)||!S(e.payload))throw new xe("element must have a payload");let t=e.payload;switch(e.kind){case"text":{let n={...tt(t,"#FFFFFF"),value:S(t.value)?ne(t.value):E(""),fontSize:G(t.fontSize,14),fontWeight:bt(t.fontWeight)??"regular"};return t.countdown===!0&&(n.countdown=!0),{kind:"text",payload:n}}case"icon":return{kind:"icon",payload:{...tt(t,"#FFFFFF"),symbol:S(t.symbol)?ne(t.symbol):E("lightbulb"),size:G(t.size,14)}};case"gauge":return{kind:"gauge",payload:{...tt(t,"#FFFFFF"),value:S(t.value)?ne(t.value):E("50"),minValue:G(t.minValue,0),maxValue:G(t.maxValue,100),style:bt(t.style)??"arc",lineWidth:G(t.lineWidth,4),trackColorHex:K(t.trackColorHex,"#FFFFFF40")}};case"shape":{let n={...tt(t,"#FFFFFF33"),kind:bt(t.kind)??"roundedRectangle",cornerRadius:G(t.cornerRadius,6),borderWidth:G(t.borderWidth,1)};return typeof t.borderColorHex=="string"&&(n.borderColorHex=t.borderColorHex),{kind:"shape",payload:n}}case"image":{let{colorSlot:n,...i}=tt(t,"#FFFFFF"),a={...i,entity:Be(S(t.entity)?t.entity:{}),contentMode:t.contentMode==="fit"?"fit":"fill",zoom:G(t.zoom,1),panX:G(t.panX,0),panY:G(t.panY,0),cornerRadius:G(t.cornerRadius,xt),timestampCorner:Bo.includes(t.timestampCorner)?t.timestampCorner:"topLeading",timestampSize:G(t.timestampSize,$t)};t.timestamp===!0&&(a.timestamp=!0);let r=Bt(t.timestampX),o=Bt(t.timestampY);return r!==void 0&&o!==void 0&&Number.isFinite(r)&&Number.isFinite(o)&&(a.timestampX=we(r),a.timestampY=we(o)),{kind:"image",payload:a}}case"tap":{let{colorSlot:n,...i}=tt(t,"#FFFFFF"),a={...i,action:S(t.action)?fa(t.action):{type:"refresh"}};return typeof t.openPageId=="string"&&(a.openPageId=t.openPageId),typeof t.openPageName=="string"&&(a.openPageName=t.openPageName),typeof t.attachedTo=="string"&&(a.attachedTo=t.attachedTo.toUpperCase()),{kind:"tap",payload:a}}default:throw new xe(`unknown element kind ${String(e.kind)}`)}}function oa(e){let t=S(e)?e:{},n={};if(S(t.placements))for(let[a,r]of Object.entries(t.placements)){if(!S(r))continue;let o={frame:ha(r.frame),isHidden:r.isHidden===!0},l=Bt(r.size);l!==void 0&&(o.size=l),n[a.toUpperCase()]=o}let i={placements:n,cornerBodyShape:t.cornerBodyShape==="circle"?"circle":"wedge",borderWidth:G(t.borderWidth,2),rules:ma(t.rules)};if(S(t.bezelText)&&(i.bezelText=ne(t.bezelText)),t.bezelCountdown===!0&&(i.bezelCountdown=!0),S(t.curvedText)&&(i.curvedText=ne(t.curvedText)),typeof t.curvedColorHex=="string"&&(i.curvedColorHex=t.curvedColorHex),S(t.bezelGauge)){let a=t.bezelGauge,r={value:S(a.value)?ne(a.value):E("50"),minValue:G(a.minValue,0),maxValue:G(a.maxValue,100),colorHexes:Array.isArray(a.colorHexes)&&a.colorHexes.length>0?a.colorHexes.filter(o=>typeof o=="string"):["#34C759","#FFCC00","#FF3B30"]};S(a.minLabel)&&(r.minLabel=ne(a.minLabel)),S(a.maxLabel)&&(r.maxLabel=ne(a.maxLabel)),i.bezelGauge=r}return typeof t.backgroundColorHex=="string"&&(i.backgroundColorHex=t.backgroundColorHex),typeof t.borderColorHex=="string"&&(i.borderColorHex=t.borderColorHex),i}function qo(e){let t={};if(Array.isArray(e))for(let n=0;n+1<e.length;n+=2){let i=e[n];typeof i=="string"&&(t[i]=oa(e[n+1]))}else if(S(e))for(let[n,i]of Object.entries(e))t[n]=oa(i);return t}function Yo(e){let t={value:S(e.value)?ne(e.value):E("")};return typeof e.label=="string"&&(t.label=e.label),typeof e.symbol=="string"&&(t.symbol=e.symbol),e.countdown===!0&&(t.countdown=!0),t}function fa(e){if(!S(e)||typeof e.type!="string")return{type:"none"};switch(e.type){case"none":case"refresh":case"openApp":case"openPage":case"openRoomPage":case"timerStartPause":case"timerCancel":return{type:e.type};case"toggleEntity":case"runScene":case"runScript":case"addTodo":case"runHTTPAction":return{type:e.type,...Be(e)};default:return{type:"none"}}}function ga(e){if(!S(e))throw new xe("config must be an object");for(let r of["id","name","slotIndex","supportedFamilies","perFamily","tapAction"])if(!(r in e))throw new xe(`${r} is required`);let t=(Array.isArray(e.values)?e.values:[]).filter(S).map(r=>({id:K(r.id).toUpperCase(),name:K(r.name),value:S(r.value)?ne(r.value):E("")})),n=(Array.isArray(e.dataSources)?e.dataSources:[]).filter(S).map(r=>r.kind==="template"?{kind:"template",value:K(r.value)}:r.kind==="entity"?{kind:"entity",...Be(r)}:null).filter(r=>r!==null),i={schemaVersion:G(e.schemaVersion,1),id:K(e.id).toUpperCase(),name:K(e.name,"Custom"),values:t,slotIndex:G(e.slotIndex,0),elements:(Array.isArray(e.elements)?e.elements:[]).map(Wo),supportedFamilies:(Array.isArray(e.supportedFamilies)?e.supportedFamilies:[]).filter(r=>typeof r=="string"),perFamily:qo(e.perFamily),dataSources:n,tapAction:fa(e.tapAction)};S(e.inline)&&(i.inline=Yo(e.inline));let a=Bt(e.refreshMinutes);if(a!==void 0&&(i.refreshMinutes=a),typeof e.openPageId=="string"&&(i.openPageId=e.openPageId),typeof e.openPageName=="string"&&(i.openPageName=e.openPageName),typeof e.showSuccessFlash=="boolean"&&(i.showSuccessFlash=e.showSuccessFlash),typeof e.successFlashColorHex=="string"&&(i.successFlashColorHex=e.successFlashColorHex),Array.isArray(e.groups)){let r=e.groups.filter(S).filter(o=>typeof o.id=="string").map(o=>({id:K(o.id).toUpperCase(),name:K(o.name,"Group"),locked:o.locked!==!1}));r.length>0&&(i.groups=r)}return ze(i),i}function B(e){return Number.isNaN(e)?"nan":e===1/0?"+inf":e===-1/0?"-inf":e}function Ge(e){let t={entityId:e.entityId,displayName:e.displayName,domain:e.domain};return e.iconName!==void 0&&(t.iconName=e.iconName),t}function Jo(e){let t={};return e.decimals!==void 0&&(t.decimals=B(e.decimals)),e.multiply!==void 0&&(t.multiply=B(e.multiply)),e.offset!==void 0&&(t.offset=B(e.offset)),e.prefix&&(t.prefix=e.prefix),e.suffix&&(t.suffix=e.suffix),e.useEntityUnit&&(t.useEntityUnit=!0),e.relativeTime&&(t.relativeTime=!0),e.textCase!==void 0&&(t.textCase=e.textCase),t}function Xo(e){let t=e.scope.kind==="entities"?{kind:"entities",entities:e.scope.entities.map(Ge)}:{kind:"filter",domains:e.scope.domains,areaIds:e.scope.areaIds,labelIds:e.scope.labelIds,floorIds:e.scope.floorIds},n={function:e.function,scope:t};return e.stateFilter&&(n.stateFilter=e.stateFilter.kind==="equals"||e.stateFilter.kind==="notEquals"?{kind:e.stateFilter.kind,value:e.stateFilter.value}:{kind:e.stateFilter.kind}),e.attribute!==void 0&&(n.attribute=e.attribute),n}function Zo(e){switch(e.kind){case"literal":return{kind:"literal",value:e.value};case"entityState":return{kind:"entityState",...Ge(e)};case"entityAttribute":return{kind:"entityAttribute",...Ge(e),attribute:e.attribute};case"entityAge":return{kind:"entityAge",...Ge(e)};case"aggregate":return{kind:"aggregate",aggregate:Xo(e.aggregate)};case"time":return{kind:"time",timeField:e.timeField};case"dataAge":return{kind:"dataAge"};case"jinja":return{kind:"jinja",value:e.value};case"named":return{kind:"named",id:e.id}}}function J(e){let t={kind:Zo(e.kind)};return $e(e.format)||(t.format=Jo(e.format)),t}function Vt(e){return{x:B(e.x),y:B(e.y),width:B(e.width),height:B(e.height),rotationDegrees:B(e.rotationDegrees)}}function Qo(e){let t={kind:e.kind};switch(e.kind){case"equals":case"notEquals":case"greaterThan":case"greaterOrEqual":case"lessThan":case"lessOrEqual":case"contains":case"startsWith":case"endsWith":t.value=J(e.value??E(""));break;case"between":t.value=J(e.value??E("")),t.upper=J(e.upper??E(""));break;case"matchesRegex":t.pattern=e.pattern??"";break;case"isOneOf":t.options=e.options??[];break;default:break}return t}function sa(e){let t={kind:e.kind};switch(e.kind){case"setColor":case"setText":case"setIcon":case"setGaugeValue":case"setBorderColor":case"setBackgroundColor":t.value=J(e.value??E(""));break;case"setOpacity":case"setFontSize":case"setRotation":case"setGaugeMin":case"setGaugeMax":case"setBorderWidth":t.number=B(e.number??0);break;case"setFontWeight":t.weight=e.weight??"regular";break;default:break}return t}function Dt(e){return e.map(t=>{let n={id:t.id,cases:t.cases.map(i=>({id:i.id,when:{join:i.when.join,tests:i.when.tests.map(a=>({id:a.id,value:J(a.value),comparison:Qo(a.comparison)}))},then:i.then.map(sa)}))};return t.otherwise&&(n.otherwise=t.otherwise.map(sa)),n})}function es(e){let t=ts(e);return e.payload.groupId!==void 0&&(t.payload.groupId=e.payload.groupId),t}function ts(e){let t=n=>({id:n.id,colorSlot:{baseColorHex:n.colorSlot.baseColorHex},rules:Dt(n.rules),frame:Vt(n.frame),isHidden:n.isHidden});switch(e.kind){case"text":{let n={...t(e.payload),value:J(e.payload.value),fontSize:B(e.payload.fontSize),fontWeight:e.payload.fontWeight};return e.payload.countdown===!0&&(n.countdown=!0),{kind:"text",payload:n}}case"icon":return{kind:"icon",payload:{...t(e.payload),symbol:J(e.payload.symbol),size:B(e.payload.size)}};case"gauge":return{kind:"gauge",payload:{...t(e.payload),value:J(e.payload.value),minValue:B(e.payload.minValue),maxValue:B(e.payload.maxValue),style:e.payload.style,lineWidth:B(e.payload.lineWidth),trackColorHex:e.payload.trackColorHex}};case"shape":{let n={...t(e.payload),kind:e.payload.kind,cornerRadius:B(e.payload.cornerRadius),borderWidth:B(e.payload.borderWidth)};return e.payload.borderColorHex!==void 0&&(n.borderColorHex=e.payload.borderColorHex),{kind:"shape",payload:n}}case"image":{let n=e.payload,i={id:n.id,entity:Ge(n.entity),rules:Dt(n.rules),frame:Vt(n.frame),isHidden:n.isHidden};n.timestamp===!0&&(i.timestamp=!0),n.contentMode!=="fill"&&(i.contentMode=n.contentMode),n.zoom!==1&&(i.zoom=B(n.zoom)),n.panX!==0&&(i.panX=B(n.panX)),n.panY!==0&&(i.panY=B(n.panY)),n.cornerRadius!==xt&&(i.cornerRadius=B(n.cornerRadius));let a=Ee(n),r=a?Pn(n.timestampX,n.timestampY):n.timestampCorner;return r!=="topLeading"&&(i.timestampCorner=r),n.timestampSize!==$t&&(i.timestampSize=B(n.timestampSize)),a&&(i.timestampX=B(n.timestampX),i.timestampY=B(n.timestampY)),{kind:"image",payload:i}}case"tap":{let n=e.payload,i={id:n.id,action:ya(n.action)};return n.openPageId!==void 0&&(i.openPageId=n.openPageId),n.openPageName!==void 0&&(i.openPageName=n.openPageName),n.attachedTo!==void 0&&(i.attachedTo=n.attachedTo),i.rules=Dt(n.rules),i.frame=Vt(n.frame),i.isHidden=n.isHidden,{kind:"tap",payload:i}}}}function ns(e){let t={},n=Object.keys(e.placements);if(n.length>0){let i={};for(let a of n){let r=e.placements[a],o={frame:Vt(r.frame)};r.isHidden&&(o.isHidden=!0),r.size!==void 0&&(o.size=B(r.size)),i[a]=o}t.placements=i}if(e.bezelText&&(t.bezelText=J(e.bezelText)),e.bezelCountdown===!0&&(t.bezelCountdown=!0),e.curvedText&&(t.curvedText=J(e.curvedText)),e.curvedColorHex!==void 0&&(t.curvedColorHex=e.curvedColorHex),e.bezelGauge){let i=e.bezelGauge,a={value:J(i.value),minValue:B(i.minValue),maxValue:B(i.maxValue),colorHexes:i.colorHexes};i.minLabel&&(a.minLabel=J(i.minLabel)),i.maxLabel&&(a.maxLabel=J(i.maxLabel)),t.bezelGauge=a}return e.backgroundColorHex!==void 0&&(t.backgroundColorHex=e.backgroundColorHex),t.cornerBodyShape=e.cornerBodyShape,e.borderColorHex!==void 0&&(t.borderColorHex=e.borderColorHex),t.borderWidth=B(e.borderWidth),e.rules.length>0&&(t.rules=Dt(e.rules)),t}function ya(e){return"entityId"in e?{type:e.type,...Ge(e)}:{type:e.type}}function is(e){let t={};return e.label!==void 0&&(t.label=e.label),t.value=J(e.value),e.symbol!==void 0&&(t.symbol=e.symbol),e.countdown&&(t.countdown=!0),t}function Ut(e){let t=[];for(let i of X){let a=e.perFamily[i];a&&t.push(i,ns(a))}let n={schemaVersion:wt(e),id:e.id,name:e.name,values:e.values.map(i=>({id:i.id,name:i.name,value:J(i.value)})),slotIndex:e.slotIndex,elements:e.elements.map(es),supportedFamilies:e.supportedFamilies,perFamily:t,dataSources:e.dataSources.map(i=>i.kind==="template"?{kind:"template",value:i.value}:{kind:"entity",...Ge(i)}),tapAction:ya(e.tapAction)};return e.inline!==void 0&&(n.inline=is(e.inline)),e.refreshMinutes!==void 0&&(n.refreshMinutes=e.refreshMinutes),e.openPageId!==void 0&&(n.openPageId=e.openPageId),e.openPageName!==void 0&&(n.openPageName=e.openPageName),e.showSuccessFlash!==void 0&&(n.showSuccessFlash=e.showSuccessFlash),e.successFlashColorHex!==void 0&&(n.successFlashColorHex=e.successFlashColorHex),e.groups!==void 0&&e.groups.length>0&&(n.groups=e.groups.map(i=>({id:i.id,name:i.name,locked:i.locked}))),n}function Ue(e,t){let i=e.elements.find(a=>a.payload.id===t)?.payload.groupId;return i===void 0?void 0:e.groups?.find(a=>a.id===i)}function Le(e,t){return e.elements.filter(n=>n.payload.groupId===t&&!se(e,n))}function ze(e){let t=new Set((e.groups??[]).map(a=>a.id));for(let a of e.elements)a.payload.groupId!==void 0&&!t.has(a.payload.groupId)&&delete a.payload.groupId;let n=new Set(e.elements.map(a=>a.payload.groupId).filter(a=>a!==void 0)),i=(e.groups??[]).filter(a=>n.has(a.id));i.length===0?delete e.groups:e.groups=i}function kt(e){if(!e.groups?.length)return;let t=e.elements.filter(r=>!se(e,r)),n=e.elements.filter(r=>se(e,r)),i=[],a=new Set;for(let r=t.length-1;r>=0;r--){let o=t[r];if(a.has(o.payload.id))continue;let l=o.payload.groupId;if(l===void 0){i.unshift(o),a.add(o.payload.id);continue}let s=t.filter(d=>d.payload.groupId===l);for(let d=s.length-1;d>=0;d--)i.unshift(s[d]),a.add(s[d].payload.id)}e.elements=[...i,...n],Ke(e)}function va(e,t,n="Group"){let i=e.elements.filter(r=>t.includes(r.payload.id)&&!se(e,r));if(i.length<2)return;let a={id:q(),name:n,locked:!0};e.groups=[...e.groups??[],a];for(let r of i)r.payload.groupId=a.id;return ze(e),kt(e),a.id}function Kt(e,t){for(let n of e.elements)n.payload.groupId===t&&delete n.payload.groupId;ze(e)}function ba(e,t,n){let i=e.elements.find(a=>a.payload.id===t);!i||se(e,i)||(n===void 0?delete i.payload.groupId:i.payload.groupId=n,ze(e),kt(e))}var V={config:["schemaVersion","id","name","values","slotIndex","elements","supportedFamilies","perFamily","inline","dataSources","refreshMinutes","tapAction","openPageId","openPageName","showSuccessFlash","successFlashColorHex","groups"],group:["id","name","locked"],inline:["label","value","symbol","countdown"],named:["id","name","value"],value:["kind","format"],format:["decimals","multiply","offset","prefix","suffix","useEntityUnit","relativeTime","textCase"],entityRef:["entityId","displayName","domain","iconName"],aggregate:["function","scope","stateFilter","attribute"],scope:["kind","entities","domains","areaIds","labelIds","floorIds"],stateFilter:["kind","value"],frame:["x","y","width","height","rotationDegrees"],elementEnvelope:["kind","payload"],elementBase:["id","colorSlot","rules","frame","isHidden","groupId"],text:["value","fontSize","fontWeight","countdown"],icon:["symbol","size"],gauge:["value","minValue","maxValue","style","lineWidth","trackColorHex"],shape:["kind","cornerRadius","borderColorHex","borderWidth"],image:["entity","timestamp","contentMode","zoom","panX","panY","cornerRadius","timestampCorner","timestampSize","timestampStyle","timestampX","timestampY"],tap:["action","openPageId","openPageName","attachedTo","grow"],colorSlot:["baseColorHex"],rule:["id","cases","otherwise"],case:["id","when","then"],condition:["join","tests"],test:["id","value","comparison"],comparison:["kind","value","upper","pattern","options"],styleChange:["kind","value","number","weight"],layout:["placements","bezelText","bezelCountdown","curvedText","curvedColorHex","bezelGauge","backgroundColorHex","cornerBodyShape","borderColorHex","borderWidth","rules"],bezelGauge:["value","minValue","maxValue","colorHexes","minLabel","maxLabel"],placement:["frame","isHidden","size"],tapAction:["type","entityId","displayName","domain","iconName"],dataSource:["kind","entityId","displayName","domain","iconName","value"]},la={literal:["kind","value"],entityState:["kind",...V.entityRef],entityAttribute:["kind",...V.entityRef,"attribute"],entityAge:["kind",...V.entityRef],aggregate:["kind","aggregate"],time:["kind","timeField"],dataAge:["kind"],jinja:["kind","value"],named:["kind","id"]};function wa(e){let t=[],n=(s,d,c)=>{if(S(s))for(let p of Object.keys(s))d.includes(p)||t.push(`${c}.${p}`)},i=(s,d)=>{if(!S(s))return;let c=typeof s.kind=="string"?s.kind:"";n(s,la[c]??["kind"],d),c==="aggregate"&&S(s.aggregate)&&(n(s.aggregate,V.aggregate,`${d}.aggregate`),n(s.aggregate.scope,V.scope,`${d}.aggregate.scope`),S(s.aggregate.scope)&&Array.isArray(s.aggregate.scope.entities)&&s.aggregate.scope.entities.forEach((p,h)=>n(p,V.entityRef,`${d}.aggregate.scope.entities[${h}]`)),n(s.aggregate.stateFilter,V.stateFilter,`${d}.aggregate.stateFilter`))},a=(s,d)=>{if(S(s)){if(S(s.kind))n(s,V.value,d),i(s.kind,`${d}.kind`);else{let c=typeof s.kind=="string"?s.kind:"";n(s,[...la[c]??["kind"],"format"],d),c==="aggregate"&&i(s,d)}n(s.format,V.format,`${d}.format`)}},r=(s,d)=>{Array.isArray(s)&&s.forEach((c,p)=>{n(c,V.styleChange,`${d}[${p}]`),S(c)&&a(c.value,`${d}[${p}].value`)})},o=(s,d)=>{Array.isArray(s)&&s.forEach((c,p)=>{let h=`${d}[${p}]`;n(c,V.rule,h),S(c)&&(Array.isArray(c.cases)&&c.cases.forEach((y,g)=>{let x=`${h}.cases[${g}]`;n(y,V.case,x),S(y)&&(n(y.when,V.condition,`${x}.when`),S(y.when)&&Array.isArray(y.when.tests)&&y.when.tests.forEach((w,T)=>{let $=`${x}.when.tests[${T}]`;n(w,V.test,$),S(w)&&(a(w.value,`${$}.value`),n(w.comparison,V.comparison,`${$}.comparison`),S(w.comparison)&&(a(w.comparison.value,`${$}.comparison.value`),a(w.comparison.upper,`${$}.comparison.upper`)))}),r(y.then,`${x}.then`))}),r(c.otherwise,`${h}.otherwise`))})};if(!S(e))return t;n(e,V.config,"$"),Array.isArray(e.groups)&&e.groups.forEach((s,d)=>n(s,V.group,`$.groups[${d}]`)),Array.isArray(e.values)&&e.values.forEach((s,d)=>{n(s,V.named,`$.values[${d}]`),S(s)&&a(s.value,`$.values[${d}].value`)}),Array.isArray(e.elements)&&e.elements.forEach((s,d)=>{let c=`$.elements[${d}]`;if(n(s,V.elementEnvelope,c),!S(s)||!S(s.payload))return;let p=typeof s.kind=="string"?s.kind:"",h=V[p]??[];n(s.payload,[...V.elementBase,...h],`${c}.payload`),n(s.payload.colorSlot,V.colorSlot,`${c}.payload.colorSlot`),n(s.payload.frame,V.frame,`${c}.payload.frame`),o(s.payload.rules,`${c}.payload.rules`);for(let y of["value","symbol"])y in s.payload&&a(s.payload[y],`${c}.payload.${y}`);p==="image"&&n(s.payload.entity,V.entityRef,`${c}.payload.entity`),p==="tap"&&n(s.payload.action,V.tapAction,`${c}.payload.action`)});let l=[];if(Array.isArray(e.perFamily))for(let s=0;s+1<e.perFamily.length;s+=2)l.push([String(e.perFamily[s]),e.perFamily[s+1]]);else S(e.perFamily)&&l.push(...Object.entries(e.perFamily));for(let[s,d]of l){let c=`$.perFamily.${s}`;if(n(d,V.layout,c),!!S(d)){if(S(d.placements))for(let[p,h]of Object.entries(d.placements))n(h,V.placement,`${c}.placements.${p}`),S(h)&&n(h.frame,V.frame,`${c}.placements.${p}.frame`);if(a(d.bezelText,`${c}.bezelText`),a(d.curvedText,`${c}.curvedText`),S(d.bezelGauge)){let p=`${c}.bezelGauge`;n(d.bezelGauge,V.bezelGauge,p),a(d.bezelGauge.value,`${p}.value`),a(d.bezelGauge.minLabel,`${p}.minLabel`),a(d.bezelGauge.maxLabel,`${p}.maxLabel`)}o(d.rules,`${c}.rules`)}}return S(e.inline)&&(n(e.inline,V.inline,"$.inline"),a(e.inline.value,"$.inline.value")),Array.isArray(e.dataSources)&&e.dataSources.forEach((s,d)=>n(s,V.dataSource,`$.dataSources[${d}]`)),n(e.tapAction,V.tapAction,"$.tapAction"),t}function q(){let e=globalThis.crypto;if(e&&"randomUUID"in e)return e.randomUUID().toUpperCase();let t=()=>Math.floor(Math.random()*65536).toString(16).padStart(4,"0"),n=(8+Math.floor(Math.random()*4)).toString(16)+t().slice(1);return`${t()}${t()}-${t()}-4${t().slice(1)}-${n}-${t()}${t()}${t()}`.toUpperCase()}function Vn(){return{placements:{},cornerBodyShape:"circle",borderWidth:2,rules:[]}}function xa(e,t,n=[...X]){let i={};for(let r of X)n.includes(r)&&(i[r]=Vn());let a={schemaVersion:4,id:q(),name:e,values:[],slotIndex:t,elements:[],supportedFamilies:Do.filter(r=>n.includes(r)),perFamily:i,dataSources:[],refreshMinutes:0,tapAction:{type:"refresh"}};return n.includes("inline")&&(a.inline={value:E("Text")}),a.schemaVersion=wt(a),a}function Ct(e){let t=n=>({id:q(),colorSlot:{baseColorHex:n},rules:[],frame:{...ua},isHidden:!1});switch(e){case"text":return{kind:e,payload:{...t("#FFFFFF"),value:E("Text"),fontSize:14,fontWeight:"regular"}};case"icon":return{kind:e,payload:{...t("#FFFFFF"),symbol:E("lightbulb"),size:14}};case"gauge":return{kind:e,payload:{...t("#FFFFFF"),value:E("50"),minValue:0,maxValue:100,style:"arc",lineWidth:4,trackColorHex:"#FFFFFF40"}};case"shape":return{kind:e,payload:{...t("#FFFFFF33"),kind:"roundedRectangle",cornerRadius:6,borderWidth:1}};case"image":{let{colorSlot:n,...i}=t("#FFFFFF");return{kind:e,payload:{...i,entity:{entityId:"",displayName:"",domain:"camera"},contentMode:"fill",zoom:1,panX:0,panY:0,cornerRadius:xt,timestampCorner:"topLeading",timestampSize:$t}}}case"tap":{let{colorSlot:n,...i}=t("#FFFFFF");return{kind:e,payload:{...i,action:{type:"refresh"}}}}}}function E(e){return{kind:{kind:"literal",value:e}}}function $a(e,t){let n=e.perFamily[t];return!n||Object.keys(n.placements).length===0?e.elements:e.elements.map(i=>{let a=n.placements[i.payload.id];if(!a)return i;let r={...i.payload,frame:a.frame,isHidden:a.isHidden};return a.size!==void 0&&(i.kind==="text"?r.fontSize=a.size:i.kind==="icon"?r.size=a.size:i.kind==="gauge"&&(r.lineWidth=a.size)),{kind:i.kind,payload:r}})}function Wt(e){switch(e.kind){case"text":return e.payload.value;case"icon":return e.payload.symbol;case"gauge":return e.payload.value;case"shape":return;case"image":return{kind:{kind:"entityState",...e.payload.entity}};case"tap":return}}function Dn(e){let t=[],n=i=>{for(let a of i)a.value&&t.push(a.value)};for(let i of e){for(let a of i.cases){for(let r of a.when.tests)t.push(r.value),r.comparison.value&&t.push(r.comparison.value),r.comparison.upper&&t.push(r.comparison.upper);n(a.then)}i.otherwise&&n(i.otherwise)}return t}var Bn=["light","switch","fan","input_boolean","cover","lock","media_player","siren","humidifier","valve","automation","group"];function _n(e,t){let n,i=t;for(let a=0;i!==void 0&&a<4;a++){let r=i.kind;if("entityId"in r){if(r.entityId==="")return;let o={entityId:r.entityId,displayName:r.displayName,domain:r.domain};return n===void 0?{ref:o}:{ref:o,namedId:n}}if(r.kind!=="named")return;n=r.id.toUpperCase(),i=e.values.find(o=>o.id.toUpperCase()===n)?.value}}function Gn(e,t){return _n(e,Wt(t))?.ref}function Un(e,t){let n=Gn(e,t),i=n&&(n.domain||n.entityId.split(".")[0])||"";return n&&Bn.includes(i)?{type:"toggleEntity",...n,domain:i}:{type:"refresh"}}function da(e,t,n){if(Gt(t)||n.width<=0||n.height<=0)return{...e};let i=t,a=e.x-i.left/n.width,r=e.x+e.width+i.right/n.width,o=e.y-i.top/n.height,l=e.y+e.height+i.bottom/n.height;return r<a&&(a=r=(a+r)/2),l<o&&(o=l=(o+l)/2),a=we(a),r=we(r),o=we(o),l=we(l),{...e,x:a,y:o,width:Math.max(0,r-a),height:Math.max(0,l-o)}}function ka(e,t,n){let i=a=>Math.round(a*100)/100||0;return{left:i((e.x-t.x)*n.width),right:i((t.x+t.width-e.x-e.width)*n.width),top:i((e.y-t.y)*n.height),bottom:i((t.y+t.height-e.y-e.height)*n.height)}}function Ca(e,t,n,i){let a=e.elements.find(h=>h.payload.id===t);if(!a||a.kind!=="tap"||a.payload.attachedTo===void 0)return;let r=e.elements.find(h=>h.payload.id===a.payload.attachedTo);if(!r)return;let o=e.perFamily[n]?.placements[r.payload.id]?.frame??r.payload.frame,l=we(i.x),s=we(i.y),d=we(i.x+i.width),c=we(i.y+i.height),p={...i,x:l,y:s,width:Math.max(0,d-l),height:Math.max(0,c-s)};a.payload.outset=ka(o,p,ge[n])}function Sa(e,t,n){let i=e.elements.find(l=>l.payload.id===t);if(!i)return;let a=e.perFamily[n];if(!a)return;let r=a.placements[t]?.frame??i.payload.frame,o=ge[n];return{width:r.width*o.width,height:r.height*o.height}}function ye(e,t){return e.elements.filter(n=>n.kind==="tap"&&n.payload.attachedTo===t)}function se(e,t){return t.kind!=="tap"||t.payload.attachedTo===void 0?!1:e.elements.some(n=>n.payload.id===t.payload.attachedTo&&n.kind!=="tap")}function Kn(e,t){let n=e.elements.find(i=>i.payload.id===t);if(n){if(n.kind==="tap"&&n.payload.attachedTo!==void 0){let i=e.elements.find(a=>a.payload.id===n.payload.attachedTo);if(i)return i.payload.id}return n.payload.id}}function Ke(e){let t=new Map(e.elements.map(a=>[a.payload.id,a])),n=new Map;for(let a of e.elements){if(a.kind!=="tap")continue;let r=a.payload.attachedTo;if(r===void 0)continue;let o=t.get(r);if(!o||o.kind==="tap"||r===a.payload.id){delete a.payload.attachedTo;continue}let l=n.get(r);l?l.push(a):n.set(r,[a])}if(n.size===0)return;for(let[a,r]of n){let o=t.get(a);for(let l of r){let s=l.payload;s.outset===void 0&&(s.outset=ka(o.payload.frame,s.frame,ge.rectangular));let d=s.outset,c=!Gt(d);l.payload.frame=da(o.payload.frame,d,ge.rectangular),l.payload.isHidden=o.payload.isHidden;for(let p of X){let h=e.perFamily[p];if(!h)continue;let y=ge[p],g=h.placements[a];if(c){let x=g?.frame??o.payload.frame,w=g?.isHidden??o.payload.isHidden;h.placements[l.payload.id]={frame:da(x,d,y),isHidden:w}}else g?h.placements[l.payload.id]={frame:{...g.frame},isHidden:g.isHidden}:delete h.placements[l.payload.id]}}}let i=[];for(let a of e.elements){if(a.kind==="tap"&&a.payload.attachedTo!==void 0)continue;i.push(a);let r=n.get(a.payload.id);r&&i.push(...r)}e.elements=i}function jt(e,t,n){let i=e.elements.find(l=>l.payload.id===t);if(!i||i.kind==="tap")return;let a=ye(e,t)[0];if(a)return a.payload;let r=Ct("tap"),o=r.payload;return o.attachedTo=t,o.outset={...Nn},o.action=n??Un(e,i),e.elements.push(r),Ke(e),o}function Wn(e,t){let n=ye(e,t).map(i=>i.payload.id);if(n.length!==0){e.elements=e.elements.filter(i=>!n.includes(i.payload.id));for(let i of X)for(let a of n)delete e.perFamily[i]?.placements[a]}}function Ea(e,t){Wn(e,t),e.elements=e.elements.filter(n=>n.payload.id!==t);for(let n of X)delete e.perFamily[n]?.placements[t];Ke(e),ze(e)}function Ta(e,t){let n=e.elements.findIndex(s=>s.payload.id===t),i=e.elements[n];if(!i)return;let a=q(),r=structuredClone(i);r.payload.id=a,r.payload.frame={...r.payload.frame,x:Math.min(.9,r.payload.frame.x+.05),y:Math.min(.9,r.payload.frame.y+.05)};let o=[r],l=[[t,a]];for(let s of ye(e,t)){let d=structuredClone(s);d.payload.id=q(),d.payload.attachedTo=a,o.push(d),l.push([s.payload.id,d.payload.id])}e.elements.splice(n+1,0,...o);for(let s of X){let d=e.perFamily[s];if(d)for(let[c,p]of l){let h=d.placements[c];h&&(d.placements[p]=structuredClone(h))}}return Ke(e),a}function qt(e,t){let n=e.elements.find(r=>r.payload.id===t);if(!n)return[];let i=[],a=_n(e,Wt(n));if(a){let r=n.kind==="icon"?"symbol":n.kind==="image"?"camera":"value";i.push(a.namedId===void 0?{where:r,ref:a.ref}:{where:r,ref:a.ref,namedId:a.namedId})}for(let r of ye(e,t)){let o=r.payload.action;!("entityId"in o)||o.entityId===""||i.push({where:"tap",ref:{entityId:o.entityId,displayName:o.displayName,domain:o.domain},tapId:r.payload.id})}for(let r of n.payload.rules)for(let o of r.cases)for(let l of o.when.tests){let s=_n(e,l.value);if(!s)continue;let d={where:"test",ref:s.ref,ruleId:r.id,caseId:o.id,testId:l.id};s.namedId!==void 0&&(d.namedId=s.namedId),i.push(d)}return i}function ca(e,t,n){if(!e)return;let i=e.kind;switch(i.kind){case"entityState":return{...e,kind:{kind:"entityState",...t}};case"entityAge":return{...e,kind:{kind:"entityAge",...t}};case"entityAttribute":return{...e,kind:{kind:"entityAttribute",...t,attribute:i.attribute}};case"literal":return n==="text"||n==="gauge"?{...e,kind:{kind:"entityState",...t}}:void 0;default:return}}function Fa(e,t,n){let i=e.elements.find(r=>r.payload.id===t);if(!i||n.entityId==="")return;let a={...n,domain:n.domain||n.entityId.split(".")[0]||""};if(i.kind==="image")i.payload.entity=a;else if(i.kind==="text"||i.kind==="gauge"){let r=ca(i.payload.value,a,i.kind);r&&(i.payload.value=r)}else if(i.kind==="icon"){let r=ca(i.payload.symbol,a,i.kind);r&&(i.payload.symbol=r)}for(let r of ye(e,t)){let o=r.payload;"entityId"in o.action&&(o.action={type:o.action.type,...a})}}var Yt={text:["color","opacity","text","fontSize","fontWeight","rotation","visibility"],icon:["color","opacity","icon","fontSize","rotation","visibility"],gauge:["color","opacity","gaugeValue","gaugeMin","gaugeMax","rotation","visibility"],shape:["color","opacity","borderColor","borderWidth","rotation","visibility"],image:["opacity","rotation","visibility"],tap:["visibility"],layout:["backgroundColor","borderColor","borderWidth","text"]},Ra=["isOn","isOff","equals","notEquals","isUnavailable","isStale","isEmpty","greaterThan","greaterOrEqual","lessThan","lessOrEqual","between","contains","startsWith","endsWith","matchesRegex","isOneOf"];function We(e){switch(e){case"isOn":case"isOff":case"isUnavailable":case"isStale":case"isEmpty":return"none";case"between":return"between";case"matchesRegex":return"pattern";case"isOneOf":return"options";default:return"value"}}function Jt(e){switch(e){case"hide":case"show":return"none";case"setFontWeight":return"weight";case"setOpacity":case"setFontSize":case"setRotation":case"setGaugeMin":case"setGaugeMax":case"setBorderWidth":return"number";default:return"value"}}function jn(){return{id:q(),value:E(""),comparison:{kind:"isOn"}}}function qn(){return{id:q(),when:{join:"all",tests:[jn()]},then:[]}}function St(){return{id:q(),cases:[qn()]}}function Yn(e,t){let n={kind:t};switch(We(t)){case"value":n.value=e.value??E("");break;case"between":n.value=e.value??E(""),n.upper=e.upper??E("");break;case"pattern":n.pattern=e.pattern??"";break;case"options":n.options=e.options??[];break;case"none":break}return n}function je(e){let t={kind:e};switch(Jt(e)){case"value":t.value=E(e==="setColor"||e==="setBorderColor"||e==="setBackgroundColor"?"#FF453A":e==="setIcon"?"exclamationmark.triangle":e==="setGaugeValue"?"50":"Text");break;case"number":t.number=e==="setOpacity"?.5:e==="setFontSize"?14:e==="setBorderWidth"?2:e==="setGaugeMax"?100:0;break;case"weight":t.weight="bold";break;case"none":break}return t}function Ia(e){return e.appliedToken===void 0?{kind:"unsupported"}:e.token===e.appliedToken?{kind:"sent"}:e.pending&&e.polling?{kind:"sending"}:e.polling?{kind:"waiting"}:{kind:"offline"}}function Aa(e){switch(e.kind){case"unsupported":return{label:"",title:"",resend:!1};case"sent":return{label:"On watch",title:"The watch has applied every change here.",resend:!1};case"sending":return{label:"Sending\u2026",title:"Waiting for the watch to pull and confirm.",resend:!1};case"waiting":return{label:"Not on watch yet",title:"The watch is connected but has not confirmed the latest change. Resend wakes it again.",resend:!0};case"offline":return{label:"Open the watch app to sync",title:"Saves reach the watch by themselves while Wrist Assistant is open on this home. Open the app, or switch the watch to this home, and it pulls at once.",resend:!0}}}function La(e){let t=new TextEncoder().encode(e),n=0xcbf29ce484222325n,i=0x100000001b3n,a=0xffffffffffffffffn;for(let r of t)n^=BigInt(r),n=n*i&a;return n.toString(16)}function za(e){return new Map(e.map(t=>[t.id.toUpperCase(),t.value]))}function Ma(e){return e.kind==="entityAttribute"||e.kind==="entityAge"||e.kind==="aggregate"||e.kind==="time"||e.kind==="jinja"}function Xn(e,t,n=0){let i=t instanceof Map?t:za(t),a=e.kind;if(a.kind==="named"){if(n>8)return;let o=i.get(a.id.toUpperCase());return o?o.kind.kind==="named"?Xn(o,i,n+1):Ma(o.kind)?"n_"+a.id.toLowerCase().replace(/-/g,""):void 0:void 0}if(!Ma(a))return;let r=Jn(a);if(r!==void 0)return"e_"+La(r)}function ve(e){return"'"+e.replace(/\\/g,"\\\\").replace(/'/g,"\\'")+"'"}function as(e){let t;if(e.scope.kind==="entities")t=`expand([${e.scope.entities.map(o=>ve(o.entityId)).join(", ")}])`;else{let{domains:o,areaIds:l,labelIds:s,floorIds:d}=e.scope;if(!(l.length+s.length+d.length>0))t=o.length===0?"[]":"("+o.map(p=>`(states.${p} | list)`).join(" + ")+")";else{let p=[];for(let h of l)p.push(`area_entities(${ve(h)})`);for(let h of s)p.push(`label_entities(${ve(h)})`);d.length>0&&p.push(`((${d.map(h=>`floor_areas(${ve(h)})`).join(" + ")}) | map('area_entities') | sum(start=[]))`),t=`(expand(${p.join(" + ")})`,o.length>0&&(t+=` | selectattr('domain', 'in', [${o.map(ve).join(", ")}])`),t+=")"}}let n=t,i=e.stateFilter;if(i&&(i.kind==="isOn"?n+=" | selectattr('state', 'eq', 'on')":i.kind==="isOff"?n+=" | selectattr('state', 'eq', 'off')":i.kind==="equals"?n+=` | selectattr('state', 'eq', ${ve(i.value)})`:n+=` | rejectattr('state', 'eq', ${ve(i.value)})`),e.function==="count")return`(${n} | list | count)`;let a=e.attribute?`attributes.${e.attribute}`:"state",r=`${n} | map(attribute=${ve(a)}) | map('float', 0) | list`;switch(e.function){case"sum":return`(${r} | sum)`;case"average":return`(${r} | average(0))`;case"min":return`(${r} | min(default=0))`;case"max":return`(${r} | max(default=0))`}}function Jn(e){switch(e.kind){case"entityAttribute":return`state_attr(${ve(e.entityId)}, ${ve(e.attribute)})`;case"entityAge":{let t=ve(e.entityId);return`(((now() - states[${t}].last_changed).total_seconds() if states[${t}] is not none else 0) | round(0))`}case"time":switch(e.timeField){case"now":return"now().strftime('%H:%M')";case"hour":return"now().hour";case"minute":return"now().minute";case"day":return"now().day";case"month":return"now().month";case"weekday":return"now().weekday()";case"timestamp":return"(as_timestamp(now()) | round(0))"}return;case"jinja":return e.value.trim().length===0?void 0:e.value;case"aggregate":return as(e.aggregate);default:return}}function Zn(e){let t=new Map,n=new Map,i=za(e.values),a=(o,l=0)=>{let s=o.kind;switch(s.kind){case"literal":case"dataAge":return;case"entityState":t.set(s.entityId,s);return;case"named":{if(l>8)return;let d=i.get(s.id.toUpperCase());if(!d)return;if(d.kind.kind==="named"){a(d,l+1);return}if(d.kind.kind==="entityState"){t.set(d.kind.entityId,d.kind);return}let c=Jn(d.kind);if(c===void 0)return;n.set("n_"+s.id.toLowerCase().replace(/-/g,""),c);return}default:{let d=Jn(s);if(d===void 0)return;n.set("e_"+La(d),d)}}};for(let o of e.values)a({kind:{kind:"named",id:o.id}});for(let o of e.elements){let l=Wt(o);l&&a(l);for(let s of Dn(o.payload.rules))a(s)}for(let o of X){if(!e.supportedFamilies.includes(o))continue;let l=e.perFamily[o];if(l){l.bezelText&&a(l.bezelText),l.curvedText&&a(l.curvedText),l.bezelGauge&&(a(l.bezelGauge.value),l.bezelGauge.minLabel&&a(l.bezelGauge.minLabel),l.bezelGauge.maxLabel&&a(l.bezelGauge.maxLabel));for(let s of Dn(l.rules))a(s)}}e.supportedFamilies.includes("inline")&&e.inline&&a(e.inline.value);let r={entities:t,expressions:n};return n.size>0&&(r.document=rs(n)),r}function rs(e){let t=[...e.keys()].sort(),n=[];for(let a of t){let r=e.get(a);r.includes("{{")||r.includes("{%")?n.push(`{% set v_${a} %}${r}{% endset %}`):n.push(`{% set v_${a} = ${r} %}`)}let i=t.map(a=>`"${a}": v_${a}`).join(", ");return n.push(`{{ { ${i} } | to_json }}`),n.join(`
`)}function _a(e){let t;try{t=JSON.parse(e)}catch{return}if(typeof t!="object"||t===null||Array.isArray(t))return;let n=new Map,i=new Set;for(let[a,r]of Object.entries(t))r===null?i.add(a):n.set(a,os(r));return{values:n,nullKeys:i}}function os(e){return typeof e=="string"?e:typeof e=="boolean"?e?"true":"false":typeof e=="number"?(Number.isInteger(e)&&Math.abs(e)<1e15,String(e)):JSON.stringify(e)}function Qn(e){let t=Zn(e),n=[...t.entities.entries()].sort(([i],[a])=>i<a?-1:i>a?1:0).map(([,i])=>({kind:"entity",entityId:i.entityId,displayName:i.displayName,domain:i.domain,...i.iconName!==void 0?{iconName:i.iconName}:{}}));return t.document&&n.push({kind:"template",value:t.document}),n}function Xt(e){let t=e;if(/^[+-]?(\d+\.?\d*|\.\d+)([eE][+-]?\d+)?$/.test(t))return Number(t);let n=t.toLowerCase();if(n==="inf"||n==="+inf"||n==="infinity"||n==="+infinity")return 1/0;if(n==="-inf"||n==="-infinity")return-1/0;if(n==="nan"||n==="+nan"||n==="-nan")return NaN}function nt(e){let t=e.trim(),n=Xt(t);if(n!==void 0)return n;let i="";for(let r of t)if(/\p{N}/u.test(r)||r==="."||r==="-"||r==="+")i+=r;else if(i.length>0)break;return i.length===0?void 0:Xt(i)}function ss(e){return Number.isInteger(e)&&Math.abs(e)<1e16?e.toFixed(1):String(e)}function ls(e){let t=Math.max(0,e);return t<60?`${Math.trunc(t)}s`:t<3600?`${Math.trunc(t/60)}m`:t<86400?`${Math.trunc(t/3600)}h`:`${Math.trunc(t/86400)}d`}function ds(e){return e.replace(/\S+/g,t=>t.charAt(0).toUpperCase()+t.slice(1).toLowerCase())}function cs(e,t,n){if($e(t))return e;let i=t,a=e,r=Xt(e.trim());if(i.relativeTime&&r!==void 0)a=ls(r);else{let o=nt(e);if(o!==void 0){let l=o*(i.multiply??1)+(i.offset??0);i.decimals!==void 0?a=l.toFixed(Math.max(0,i.decimals)):l!==o&&(a=Number.isInteger(l)?String(l):ss(l))}}switch(i.useEntityUnit&&n&&(a+=n.startsWith("\xB0")||n.startsWith("%")?n:` ${n}`),i.prefix&&(a=i.prefix+a),i.suffix&&(a=a+i.suffix),i.textCase){case"upper":a=a.toUpperCase();break;case"lower":a=a.toLowerCase();break;case"capitalized":a=ds(a);break}return a}function it(e){let t=Math.trunc(Math.max(0,e)),n=Math.trunc(t/3600),i=Math.trunc(t%3600/60),a=t%60,r=o=>String(o).padStart(2,"0");return n>0?`${n}:${r(i)}:${r(a)}`:`${i}:${r(a)}`}function ps(e,t,n){if(e===void 0)return 0;let i=nt(e);if(i===void 0||Number.isNaN(i))return 0;let a=n-t;return a===0?0:Math.min(1,Math.max(0,(i-t)/a))}var Fe=class{constructor(t){this.ctx=t;this.named=new Map(t.namedValues.map(n=>[n.id.toUpperCase(),n.value]))}dereference(t){let n=t,i=new Set,a=t.format;for(;n.kind.kind==="named";){let o=n.kind.id.toUpperCase();if(i.has(o))return;i.add(o);let l=this.named.get(o);if(!l)return;a=a&&!$e(a)?a:l.format,n=l}let r={kind:n.kind};return a&&(r.format=a),r}directEntityUnit(t){let n=t.kind;if(n.kind==="entityState"||n.kind==="entityAttribute"||n.kind==="entityAge")return this.ctx.entityStates.get(n.entityId)?.unitOfMeasurement}resolve(t){if(!t)return;let n=this.dereference(t);if(!n)return;let i;switch(n.kind.kind){case"literal":i=n.kind.value;break;case"entityState":i=this.ctx.entityStates.get(n.kind.entityId)?.state;break;case"dataAge":i=this.ctx.dataAgeSeconds===void 0?void 0:String(Math.trunc(this.ctx.dataAgeSeconds));break;default:{let a=Xn(t,this.named);i=a===void 0?void 0:this.ctx.templateResults.get(a)}}if(i!==void 0)return cs(i,n.format,this.directEntityUnit(n))}nowMs(){return this.ctx.nowMs??Date.now()}countdownEnd(t){if(!t)return;let n=this.dereference(t);if(!n)return;let i=n.kind;if(i.kind==="entityState"){let o=this.ctx.entityStates.get(i.entityId);if(o?.timerState!==void 0){if(o.timerState!=="active"||!o.finishesAt)return;let l=Date.parse(o.finishesAt);return Number.isFinite(l)&&l>this.nowMs()?l:void 0}}let a=this.resolve(t)?.trim();if(!a)return;let r=Date.parse(a);if(!Number.isFinite(r)){let o=Xt(a);r=o===void 0?NaN:o*1e3}return Number.isFinite(r)&&r>this.nowMs()?r:void 0}countdownFallbackText(t){if(!t)return;let n=this.dereference(t);if(!n||n.kind.kind!=="entityState")return;let i=this.ctx.entityStates.get(n.kind.entityId);if(i?.timerState!==void 0)return i.timerState==="paused"?i.remaining!==void 0&&i.remaining>0?it(i.remaining):"Paused":"Idle"}entityIcon(t){let n=this.dereference(t);return!n||n.kind.kind!=="entityState"?void 0:this.ctx.entityStates.get(n.kind.entityId)?.iconName??n.kind.iconName}isStale(){return(this.ctx.dataAgeSeconds??1/0)>(this.ctx.stalenessThresholdSeconds??1200)}evaluateTest(t){let n=t.comparison;if(n.kind==="isStale")return this.isStale();let i=this.resolve(t.value);if(i===void 0)return n.kind==="isUnavailable";let a=nt(i),r=()=>this.resolve(n.value),o=()=>{let s=r();return s===void 0?void 0:nt(s)},l=s=>{let d=o();return a===void 0||d===void 0?!1:s(a,d)};switch(n.kind){case"equals":{let s=r();return s!==void 0&&i===s}case"notEquals":{let s=r();return s!==void 0&&i!==s}case"isOn":return i.toLowerCase()==="on";case"isOff":return i.toLowerCase()==="off";case"isUnavailable":{let s=i.toLowerCase();return s==="unavailable"||s==="unknown"}case"isEmpty":return i.trim().length===0;case"greaterThan":return l((s,d)=>s>d);case"greaterOrEqual":return l((s,d)=>s>=d);case"lessThan":return l((s,d)=>s<d);case"lessOrEqual":return l((s,d)=>s<=d);case"between":{let s=o(),d=this.resolve(n.upper),c=d===void 0?void 0:nt(d);if(a===void 0||s===void 0||c===void 0)return!1;let[p,h]=s<=c?[s,c]:[c,s];return a>=p&&a<=h}case"contains":{let s=r();return!!s&&i.toLowerCase().includes(s.toLowerCase())}case"startsWith":{let s=r();return!!s&&i.toLowerCase().startsWith(s.toLowerCase())}case"endsWith":{let s=r();return!!s&&i.toLowerCase().endsWith(s.toLowerCase())}case"matchesRegex":{if(!n.pattern)return!1;try{return new RegExp(n.pattern).test(i)}catch{return!1}}case"isOneOf":return(n.options??[]).some(s=>s.toLowerCase()===i.toLowerCase());default:return!1}}evaluateCondition(t){return t.tests.length===0?!0:t.join==="any"?t.tests.some(n=>this.evaluateTest(n)):t.tests.every(n=>this.evaluateTest(n))}applyRules(t,n){let i=new Map;for(let a of t){let r=n?.get(a.id),o=[];if(r&&r!=="live")r==="otherwise"?o=a.otherwise??[]:o=a.cases.find(l=>l.id===r.caseId)?.then??[];else{let l=a.cases.find(s=>this.evaluateCondition(s.when));o=l?l.then:a.otherwise??[]}for(let l of o)i.set(le[l.kind],l)}return i}liveBranches(t){let n=new Map;for(let i of t){let a=i.cases.find(r=>this.evaluateCondition(r.when));n.set(i.id,a?a.id:i.otherwise?"otherwise":"none")}return n}styleColor(t,n){let i=t.get(n);if(!i)return;let a=this.resolve(i.value);return a||void 0}styleText(t,n){let i=t.get(n);return i?this.resolve(i.value):void 0}styleNumber(t,n){return t.get(n)?.number}resolveElement(t,n){let i=t.payload,a=this.applyRules(i.rules,n),r=a.get("visibility"),o=r?r.kind==="hide":i.isHidden,l=this.styleNumber(a,"rotation"),s=l===void 0?i.frame:{...i.frame,rotationDegrees:l},d=this.styleNumber(a,"opacity")??1,c={id:i.id,isHidden:o,frame:s,opacity:d};switch(t.kind){case"text":{let p=t.payload.countdown?this.countdownEnd(t.payload.value):void 0,h=t.payload.countdown?this.countdownFallbackText(t.payload.value):void 0,y={kind:"text",...c,text:this.styleText(a,"text")??h??this.resolve(t.payload.value)??"--",fontSize:this.styleNumber(a,"fontSize")??t.payload.fontSize,fontWeight:a.get("fontWeight")?.weight??t.payload.fontWeight,colorHex:this.styleColor(a,"color")??t.payload.colorSlot.baseColorHex};return p!==void 0&&(y.countdownEnd=p),y}case"icon":{let p=this.entityIcon(t.payload.symbol)??this.resolve(t.payload.symbol)??"questionmark.circle";return{kind:"icon",...c,symbol:this.styleText(a,"icon")??p,size:this.styleNumber(a,"fontSize")??t.payload.size,colorHex:this.styleColor(a,"color")??t.payload.colorSlot.baseColorHex}}case"gauge":{let p=this.styleText(a,"gaugeValue")??this.resolve(t.payload.value),h=this.styleNumber(a,"gaugeMin")??t.payload.minValue,y=this.styleNumber(a,"gaugeMax")??t.payload.maxValue;return{kind:"gauge",...c,fraction:ps(p,h,y),style:t.payload.style,lineWidth:t.payload.lineWidth,colorHex:this.styleColor(a,"color")??t.payload.colorSlot.baseColorHex,trackColorHex:t.payload.trackColorHex}}case"shape":{let p={kind:"shape",...c,shapeKind:t.payload.kind,cornerRadius:t.payload.cornerRadius,fillColorHex:this.styleColor(a,"color")??t.payload.colorSlot.baseColorHex,borderWidth:this.styleNumber(a,"borderWidth")??t.payload.borderWidth},h=this.styleColor(a,"borderColor")??t.payload.borderColorHex;return h!==void 0&&(p.borderColorHex=h),p}case"image":{let p={kind:"image",...c,entityId:t.payload.entity.entityId,showTimestamp:t.payload.timestamp===!0,contentMode:t.payload.contentMode,zoom:t.payload.zoom,panX:t.payload.panX,panY:t.payload.panY,cornerRadius:t.payload.cornerRadius,timestampCorner:t.payload.timestampCorner,timestampSize:t.payload.timestampSize};Ee(t.payload)&&(p.timestampX=t.payload.timestampX,p.timestampY=t.payload.timestampY);let h=this.ctx.entityStates.get(t.payload.entity.entityId)?.entityPicture;return h!==void 0&&(p.url=h),p}case"tap":{let p={kind:"tap",...c,frame:t.payload.frame,opacity:1,action:t.payload.action};return t.payload.openPageId!==void 0&&(p.openPageId=t.payload.openPageId),t.payload.attachedTo!==void 0&&(p.attachedTo=t.payload.attachedTo),p}}}resolveLayout(t,n,i){let a=t.perFamily[n],r=$a(t,n).map(x=>this.resolveElement(x,i)),o=a?this.applyRules(a.rules,i):new Map,l={family:n,elements:r,cornerBodyShape:a?.cornerBodyShape??"wedge",borderWidth:this.styleNumber(o,"borderWidth")??a?.borderWidth??2},s=this.styleText(o,"text"),d=a?.bezelCountdown&&s===void 0?this.countdownEnd(a.bezelText):void 0,c=a?.bezelCountdown?this.countdownFallbackText(a.bezelText):void 0,p=s??c??this.resolve(a?.bezelText);p!==void 0&&(l.bezelText=p),d!==void 0&&(l.bezelCountdownEnd=d);let h=this.resolve(a?.curvedText);if(h!==void 0&&(l.curvedText=h),a?.curvedColorHex!==void 0&&(l.curvedColorHex=a.curvedColorHex),a?.bezelGauge){let x=a.bezelGauge,w=this.resolve(x.value),T=w===void 0?void 0:nt(w);if(T!==void 0){let $=Math.min(x.minValue,x.maxValue),f=Math.max(x.minValue,x.maxValue),v={value:Math.min(f,Math.max($,T)),minValue:$,maxValue:f===$?$+1:f,colorHexes:x.colorHexes},b=this.resolve(x.minLabel);b!==void 0&&(v.minLabel=b);let F=this.resolve(x.maxLabel);F!==void 0&&(v.maxLabel=F),l.bezelGauge=v}}let y=this.styleColor(o,"backgroundColor")??a?.backgroundColorHex;y!==void 0&&(l.backgroundColorHex=y);let g=this.styleColor(o,"borderColor")??a?.borderColorHex;return g!==void 0&&(l.borderColorHex=g),l}};function us(e,t){let n=new Fe(t),i=e.countdown?n.countdownEnd(e.value):void 0,r={text:(e.countdown?n.countdownFallbackText(e.value):void 0)??n.resolve(e.value)??"--"};return e.label&&(r.label=e.label),e.symbol&&(r.symbol=e.symbol),i!==void 0&&(r.countdownEnd=i),r}function ei(e,t,n){let i=new Fe(t),a={};for(let r of["rectangular","circular","corner"])e.supportedFamilies.includes(r)&&(a[r]=i.resolveLayout(e,r,n));return e.supportedFamilies.includes("inline")&&e.inline&&(a.inline=us(e.inline,t)),a}var ae=ge,Tt=[{label:"40 mm",screen:{width:162,height:197},slots:{rectangular:{width:141,height:51},circular:{width:40,height:40},corner:{width:26,height:26}},measured:!1},{label:"41 mm",screen:{width:176,height:215},slots:{rectangular:{width:153,height:55.5},circular:{width:43,height:43},corner:{width:29,height:29}},measured:!1},{label:"42 mm",screen:{width:187,height:223},slots:{rectangular:{width:163,height:59},circular:{width:46,height:46},corner:{width:31,height:31}},measured:!1},{label:"44 mm",screen:{width:184,height:224},slots:{rectangular:{width:160,height:58},circular:{width:45,height:45},corner:{width:30,height:30}},measured:!1},{label:"45 mm",screen:{width:198,height:242},slots:{rectangular:{width:172,height:62.5},circular:{width:48.5,height:48.5},corner:{width:32,height:32}},measured:!1},{label:"46 mm",screen:{width:208,height:248},slots:ae,measured:!0},{label:"49 mm",screen:{width:205,height:251},slots:{rectangular:{width:178.5,height:64.5},circular:{width:50,height:50},corner:{width:33.5,height:33.5}},measured:!1}],Ft=Tt.find(e=>e.measured);function Ua(e){if(!e)return;let t=/^(\d+)x(\d+)$/.exec(e.trim());if(!t)return;let n=Number(t[1]),i=Number(t[2]);return Tt.find(a=>a.screen.width===n&&a.screen.height===i)}function Qt(e,t){let n=ae[t];if(e.width<=0||e.height<=0)return{scale:0,x:0,y:0,width:0,height:0};let i=Math.min(e.width/n.width,e.height/n.height),a=n.width*i,r=n.height*i;return{scale:i,x:(e.width-a)/2,y:(e.height-r)/2,width:a,height:r}}var hs={regular:400,medium:500,semibold:600,bold:700};function ke(e){if(!e)return;let t=e.startsWith("#")?e.slice(1):e;if(!/^[0-9a-fA-F]{6}([0-9a-fA-F]{2})?$/.test(t))return;let n=t.length===8?parseInt(t.slice(6,8),16)/255:1;return{color:`#${t.slice(0,6)}`,opacity:n}}function Et(e,t,n="#FFFFFF"){let i=ke(e)??{color:n,opacity:1};return{[t]:i.color,[`${t}-opacity`]:i.opacity}}function Ka(e,t){let n=Math.max(0,e.frame.width*t.width),i=Math.max(0,e.frame.height*t.height),a=(e.frame.x+e.frame.width/2)*t.width,r=(e.frame.y+e.frame.height/2)*t.height;return{x:a-n/2,y:r-i/2,w:n,h:i,cx:a,cy:r}}function ms(e,t){let n=Et(e.colorHex,"fill");e.countdownEnd!==void 0&&e.countdownEnd>Date.now()&&(e={...e,text:it((e.countdownEnd-Date.now())/1e3)});let i=s=>s*.55,a=e.text.length*i(e.fontSize),r=a>t.w&&t.w>0?Math.max(.5,t.w/a):1,o=e.fontSize*r,l=e.text;if(t.w>0&&l.length*i(o)>t.w){let s=t.w-.8*o,d=Math.max(1,Math.floor(s/i(o)));l=`${l.slice(0,d).replace(/\s+$/,"")}\u2026`}return k`<text x=${t.cx} y=${t.cy} text-anchor="middle" dominant-baseline="central"
    font-family="-apple-system, 'SF Pro Text', 'Helvetica Neue', Helvetica, Arial, sans-serif"
    font-size=${o} font-weight=${hs[e.fontWeight]??400}
    fill=${n.fill} fill-opacity=${n["fill-opacity"]}>${l}</text>`}function fs(e,t){let n=Et(e.colorHex,"stroke"),i=Et(e.trackColorHex,"stroke","#FFFFFF"),a=e.lineWidth;if(e.style==="bar"){let h=t.w,y=Math.max(a,h*e.fraction);return k`
      <rect x=${t.x} y=${t.cy-a/2} width=${h} height=${a} rx=${a/2}
        fill=${i.stroke} fill-opacity=${i["stroke-opacity"]} />
      <rect x=${t.x} y=${t.cy-a/2} width=${y} height=${a} rx=${a/2}
        fill=${n.stroke} fill-opacity=${n["stroke-opacity"]} />`}let r=Math.min(t.w,t.h),o=Math.max(0,r/2-a/2),l=2*Math.PI*o,s=e.style==="ring"?1:.75,d=e.style==="ring"?-90:135,c=l*s,p=l*s*e.fraction;return k`
    <g transform="rotate(${d} ${t.cx} ${t.cy})">
      <circle cx=${t.cx} cy=${t.cy} r=${o} fill="none" stroke-width=${a} stroke-linecap="round"
        stroke=${i.stroke} stroke-opacity=${i["stroke-opacity"]}
        stroke-dasharray="${c} ${l}" />
      ${e.fraction>0?k`<circle cx=${t.cx} cy=${t.cy} r=${o} fill="none" stroke-width=${a} stroke-linecap="round"
            stroke=${n.stroke} stroke-opacity=${n["stroke-opacity"]}
            stroke-dasharray="${p} ${l}" />`:m}
    </g>`}function gs(e,t){let n=Et(e.fillColorHex,"fill"),i=e.borderColorHex?ke(e.borderColorHex):void 0,a=i?e.borderWidth:0,r=a/2,o=i?{stroke:i.color,"stroke-opacity":i.opacity,"stroke-width":a}:{stroke:"none","stroke-opacity":0,"stroke-width":0},l=k`fill=${n.fill} fill-opacity=${n["fill-opacity"]}
    stroke=${o.stroke} stroke-opacity=${o["stroke-opacity"]} stroke-width=${o["stroke-width"]}`;switch(e.shapeKind){case"circle":{let s=Math.min(t.w,t.h)/2-r;return k`<circle cx=${t.cx} cy=${t.cy} r=${Math.max(0,s)} ${l} />`}case"capsule":{let s=Math.min(t.w,t.h)/2;return k`<rect x=${t.x+r} y=${t.y+r} width=${Math.max(0,t.w-a)} height=${Math.max(0,t.h-a)} rx=${s} ${l} />`}case"roundedRectangle":return k`<rect x=${t.x+r} y=${t.y+r} width=${Math.max(0,t.w-a)} height=${Math.max(0,t.h-a)} rx=${e.cornerRadius} ${l} />`;case"rectangle":return k`<rect x=${t.x+r} y=${t.y+r} width=${Math.max(0,t.w-a)} height=${Math.max(0,t.h-a)} ${l} />`}}function ys(e,t,n){let i=n.render(e.symbol,e.size,e.colorHex);if(i)return k`<g transform="translate(${t.cx-e.size/2} ${t.cy-e.size/2})">${i}</g>`;let a=Et(e.colorHex,"stroke"),r=e.size;return k`
    <rect x=${t.cx-r/2} y=${t.cy-r/2} width=${r} height=${r} rx=${r*.2}
      fill="none" stroke=${a.stroke} stroke-opacity=${a["stroke-opacity"]} stroke-width="0.75" stroke-dasharray="1.5 1" />
    <text x=${t.cx} y=${t.cy} text-anchor="middle" dominant-baseline="central" font-size=${r*.5}
      fill=${a.stroke} fill-opacity=${a["stroke-opacity"]} font-family="sans-serif">?</text>`}var oi=.25,vs=8;function bs(e,t,n,i,a,r,o,l){let s={x:0,y:0,width:e,height:t};if(!(e>0)||!(t>0)||!(n>0)||!(i>0))return s;let d=Math.min(Math.max(Number.isFinite(r)?r:1,oi),vs),c=Math.max(e/n,t/i),p=Math.min(e/n,t/i),h=(a==="fit"?p:c)*d,y=n*h,g=i*h,x=Math.min(Math.max(Number.isFinite(o)?o:0,-1),1),w=Math.min(Math.max(Number.isFinite(l)?l:0,-1),1);return{x:-(y-e)/2*(1+x)+0,y:-(g-t)/2*(1+w)+0,width:y,height:g}}function en(e){let t=e.getHours()%12||12,n=i=>String(i).padStart(2,"0");return`${t}:${n(e.getMinutes())}:${n(e.getSeconds())}`}var Zt=4;function tn(e,t,n){let i=Math.min(Math.max(e.timestampSize,4),40),a=n.length*i*.578+i*.89,r=i*1.25;if(!(Number.isFinite(e.timestampX)&&Number.isFinite(e.timestampY))){let s=e.timestampCorner.endsWith("Leading")?t.x+Zt:t.x+t.w-Zt-a,d=e.timestampCorner.startsWith("top")?t.y+Zt:t.y+t.h-Zt-r;return{x:s,y:d,w:a,h:r,size:i,label:n}}let l=(s,d,c,p)=>p>=c?d+(c-p)/2:Math.min(d+c-p,Math.max(d,s-p/2));return{x:l(t.x+e.timestampX*t.w,t.x,t.w,a),y:l(t.y+e.timestampY*t.h,t.y,t.h,r),w:a,h:r,size:i,label:n}}function ws(e,t,n){let i=n.icons,a=`imgclip-${e.id}`,r=Math.max(0,e.cornerRadius),o=e.showTimestamp&&e.url?tn(e,t,en(new Date)):void 0,l=o?k`
        <rect data-ts-handle="1" x=${o.x} y=${o.y} width=${o.w} height=${o.h} rx=${o.h/2}
          fill="#000000" fill-opacity="0.55" />
        <text data-ts-handle="1" x=${o.x+o.w/2} y=${o.y+o.h/2} text-anchor="middle" dominant-baseline="central"
          font-size=${o.size} font-weight="600" fill="#FFFFFF"
          font-family="-apple-system, 'SF Pro Rounded', Helvetica, Arial, sans-serif">${o.label}</text>`:m,s=3,d=o&&n.timestampActiveId===e.id?k`
        <rect x=${o.x} y=${o.y} width=${o.w} height=${o.h} fill="none" stroke="#0A84FF" stroke-width="0.75"
          stroke-dasharray="2 1" vector-effect="non-scaling-stroke" pointer-events="none" />
        ${[["nw",o.x,o.y],["ne",o.x+o.w,o.y],["sw",o.x,o.y+o.h],["se",o.x+o.w,o.y+o.h]].map(([h,y,g])=>k`<rect data-ts-corner=${h} x=${y-s/2} y=${g-s/2} width=${s} height=${s}
            fill="#FFFFFF" stroke="#0A84FF" stroke-width="0.5" style="cursor:${h}-resize" />`)}`:m,c=e.url?n.imageSizes?.size(e.url):void 0,p;if(e.url&&c){let h=bs(t.w,t.h,c.width,c.height,e.contentMode,e.zoom,e.panX,e.panY);p=k`<image href=${e.url} x=${t.x+h.x} y=${t.y+h.y} width=${h.width} height=${h.height}
      preserveAspectRatio="none" />`}else e.url?p=k`<image href=${e.url} x=${t.x} y=${t.y} width=${t.w} height=${t.h}
      preserveAspectRatio=${e.contentMode==="fit"?"xMidYMid meet":"xMidYMid slice"} />`:p=k`
      <rect x=${t.x} y=${t.y} width=${t.w} height=${t.h} rx=${r} fill="#FFFFFF" fill-opacity="0.18" />
      <g transform="translate(${t.cx-7} ${t.cy-7})">${i.render("camera.fill",14,"#FFFFFF99")??m}</g>`;return k`
    <defs><clipPath id=${a}><rect x=${t.x} y=${t.y} width=${t.w} height=${t.h} rx=${r} /></clipPath></defs>
    <g clip-path=${`url(#${a})`}>${p}${l}</g>${d}`}function xs(e,t,n,i,a){if(!i)return m;let r=Math.min(10,t.w*.5,t.h*.5),o=a!==void 0?$s(a,t):void 0;return k`
    <rect x=${t.x} y=${t.y} width=${t.w} height=${t.h} rx="2" fill="#FFD60A" fill-opacity="0.08"
      stroke="#FFD60A" stroke-opacity="0.8" stroke-width="0.6" stroke-dasharray="1.5 1" vector-effect="non-scaling-stroke" />
    ${o!==void 0?k`<text x=${t.cx} y=${t.cy} text-anchor="middle" dominant-baseline="central"
          font-family="-apple-system, 'SF Pro Text', 'Helvetica Neue', Helvetica, Arial, sans-serif"
          font-size=${ni} font-weight="600" fill="#FFD60A" fill-opacity="0.95">${o}</text>`:r>=5?k`<g transform="translate(${t.cx-r/2} ${t.cy-r/2})" opacity="0.8">${n.render("hand.tap.fill",r,"#FFD60A")??m}</g>`:m}`}var ni=5;function $s(e,t){let n=ni*.55,i=t.w-2;if(t.h<ni*1.6||i<n*4)return;if(e.length*n<=i)return e;let a=Math.max(1,Math.floor(i/n)-1);return`${e.slice(0,a).replace(/\s+$/,"")}\u2026`}function ii(e,t,n){if(e.isHidden&&!n.showHidden)return m;let i=n.tapReview===!0,a=n.tapAreas===!0||i,r=i?n.tapFocusId:void 0,o=r!==void 0&&e.id===r,l=r!==void 0;if(e.kind==="tap"&&!a)return m;if(e.kind==="tap"&&e.attachedTo!==void 0&&(!i||l&&!o))return m;let s=Ka(e,t),d=i&&(!l||o),c;switch(e.kind){case"text":c=ms(e,s);break;case"icon":c=ys(e,s,n.icons);break;case"gauge":c=fs(e,s);break;case"shape":c=gs(e,s);break;case"image":c=ws(e,s,n);break;case"tap":c=xs(e,s,n.icons,a,d?Te(e.action):void 0);break}let p=i&&(e.kind!=="tap"||l&&!o)?.35:1,h=Math.min(1,Math.max(0,e.opacity))*(e.isHidden?.35:1)*p,y=n.highlightId===e.id,g=y||n.highlightIds?.includes(e.id)===!0,x=n.handles===!0&&(!l||o),w=g?k`<rect x=${s.x} y=${s.y} width=${s.w} height=${s.h} fill="none" stroke="#0A84FF" stroke-width="0.75" stroke-dasharray="2 1" vector-effect="non-scaling-stroke" />`:m,T=n.hoverId===e.id?k`<rect x=${s.x} y=${s.y} width=${s.w} height=${s.h} fill="#0A84FF" fill-opacity="0.22"
        stroke="#0A84FF" stroke-width="1" vector-effect="non-scaling-stroke" pointer-events="none" />`:m,$=k`<rect x=${s.x} y=${s.y} width=${s.w} height=${s.h} fill="transparent" stroke="none" />`,f=3,v=y&&x?[["nw",s.x,s.y],["ne",s.x+s.w,s.y],["sw",s.x,s.y+s.h],["se",s.x+s.w,s.y+s.h]].map(([b,F,M])=>k`<rect data-handle=${b} x=${F-f/2} y=${M-f/2} width=${f} height=${f}
          fill="#FFFFFF" stroke="#0A84FF" stroke-width="0.5" style="cursor:${b}-resize" />`):m;return k`<g data-element-id=${e.id} opacity=${h} style=${x?"cursor:move":m}
    transform="rotate(${e.frame.rotationDegrees} ${s.cx} ${s.cy})">${$}${c}${T}${w}${v}</g>`}function nn(e,t){return{quad:{width:104*e,height:124*e},cornerRadius:52*e,tile:t?{cx:(104-29.75)*e,cy:24*e}:{cx:70*e,cy:29.5*e},dial:{cx:0,cy:124*e,r:100.5*e},labelArc:{start:-90,end:-24}}}function si(e,t){return(t?23.5:34)*e}var Ha=10.5;function Wa(e,t){return(e===" "?.35:/[ILJ1.,:;'!|]/.test(e)?.34:/[MW]/.test(e)?.92:.66)*t}function Pa(e,t){let n=0;for(let i of e)n+=Wa(i,t);return n}function Na(e,t,n){let i=e.toUpperCase(),a=d=>Wa(d,n),r=.9*n,o=0;for(let d of i)o+=a(d);if(o<=t)return i;let l=0,s="";for(let d of i){if(l+a(d)+r>t)break;s+=d,l+=a(d)}return`${s.replace(/\s+$/,"")}\u2026`}function ai(e,t,n){let i=n*Math.PI/180;return{x:e.cx+t*Math.cos(i),y:e.cy+t*Math.sin(i)}}function ri(e,t,n,i){let a=ai(e,t,n),r=ai(e,t,i);return`M ${a.x} ${a.y} A ${t} ${t} 0 0 1 ${r.x} ${r.y}`}function ja(e,t,n,i){let{dial:a}=nn(e,!0),r=(i.end-i.start)*Math.PI/180;return{id:t,d:ri(a,n,i.start,i.end),length:n*r}}function ks(e,t){let n=nn(e,!0);return ja(e,t,n.dial.r,n.labelArc)}var Oa=18.5,Cs=113,Ss={start:-71,end:-36},Va=104,Es=6.2,Da={start:-77,end:-30.5};function Ba(e){let t=e.replace("#",""),n=i=>parseInt(t.slice(i,i+2),16)||0;return[n(0),n(2),n(4)]}function Ga(e,t){if(e.length===0)return"#34C759";if(e.length===1)return e[0];let n=Math.min(1,Math.max(0,t))*(e.length-1),i=Math.min(e.length-2,Math.floor(n)),a=n-i,r=Ba(e[i]),o=Ba(e[i+1]),l=(s,d)=>Math.round(s+(d-s)*a);return`rgb(${l(r[0],o[0])}, ${l(r[1],o[1])}, ${l(r[2],o[2])})`}var ti=11;function Ts(e,t,n){let{dial:i}=nn(t,!0),a=Va*t,r=180/(Math.PI*Va),o=e.minLabel!==void 0?Pa(e.minLabel,ti)*r:0,l=e.maxLabel!==void 0?Pa(e.maxLabel,ti)*r:0,s=Da.start+(o>0?Math.max(0,o-1.8):0),d=Da.end-(l>0?Math.max(0,l-1.8):0),c=d-s,p=24,h=[];for(let T=0;T<p;T++){let $=s+c*T/p,f=Math.min(d,s+c*(T+1)/p+.4);h.push(k`<path d=${ri(i,a,$,f)} fill="none"
      stroke=${Ga(e.colorHexes,(T+.5)/p)} stroke-width=${Es*t}
      stroke-linecap=${T===0||T===p-1?"round":"butt"} />`)}let y=(e.value-e.minValue)/(e.maxValue-e.minValue),g=ai(i,a,s+c*y),x=1.5,w=(T,$,f,v)=>k`
    <defs><path id=${T} d=${ri(i,a,$,f)} /></defs>
    <text font-size=${ti*t} font-weight="600" fill="#FFFFFF"
      font-family="-apple-system, 'SF Pro Text', Helvetica, Arial, sans-serif">
      <textPath href="#${T}" startOffset="50%" text-anchor="middle">${v}</textPath></text>`;return k`${h}
    <circle cx=${g.x} cy=${g.y} r=${3.2*t} fill=${Ga(e.colorHexes,y)}
      stroke="#000000" stroke-width=${1.2*t} />
    ${e.minLabel!==void 0?w(`${n}-gmin`,s-x-Math.max(o,3),s-x,e.minLabel):m}
    ${e.maxLabel!==void 0?w(`${n}-gmax`,d+x,d+x+Math.max(l,3),e.maxLabel):m}`}function li(e,t){let n=e.family in ae?e.family:"rectangular",i=t.slot??ae[n],a=ae[n],r=Qt(i,n),o=`clip-${n}-${Math.random().toString(36).slice(2,8)}`,l=ke(e.backgroundColorHex),s=ke(e.borderColorHex),d=e.borderWidth*r.scale;if(n==="corner"){let g=r.scale,x=!!e.bezelText||!!e.bezelGauge,w=e.curvedText??"",T=w!=="",$=nn(g,x),f=si(g,x),v=f/(a.width*g),b=$.tile.cx-f/2,F=$.tile.cy-f/2,M=`M 0 0 H ${$.quad.width-$.cornerRadius} A ${$.cornerRadius} ${$.cornerRadius} 0 0 1 ${$.quad.width} ${$.cornerRadius} V ${$.quad.height} H 0 Z`,P=m;if(e.bezelGauge)P=Ts(e.bezelGauge,g,o);else if(e.bezelText){let I=ks(g,`${o}-bezel`),H=e.bezelCountdownEnd!==void 0&&e.bezelCountdownEnd>Date.now()?it((e.bezelCountdownEnd-Date.now())/1e3):e.bezelText;P=k`<defs><path id=${I.id} d=${I.d} /></defs>
        <text font-size=${Ha*g} font-weight="600" fill="#FFFFFF" font-family="-apple-system, 'SF Pro Text', Helvetica, Arial, sans-serif">
          <textPath href="#${I.id}" startOffset="50%" text-anchor="middle">${Na(H,I.length,Ha*g)}</textPath></text>`}let C=m;if(T){let I=ke(e.curvedColorHex??"#FFFFFF")??{color:"#FFFFFF",opacity:1},H=ja(g,`${o}-curved`,Cs*g,Ss);C=k`<defs><path id=${H.id} d=${H.d} /></defs>
        <text font-size=${Oa*g} font-weight="600" fill=${I.color} fill-opacity=${I.opacity}
          font-family="-apple-system, 'SF Pro Rounded', 'SF Pro Text', Helvetica, Arial, sans-serif">
          <textPath href="#${H.id}" startOffset="50%" text-anchor="middle">${Na(w,H.length,Oa*g*.88)}</textPath></text>`}else{let I=e.borderWidth*r.scale*v,H=s?k`<circle cx=${f/2} cy=${f/2} r=${f/2-I/2} fill="none" stroke=${s.color} stroke-opacity=${s.opacity} stroke-width=${I} />`:m;C=k`<g transform="translate(${b} ${F})">
        <g clip-path=${`url(#${o})`}>
          ${l?k`<rect width=${f} height=${f} fill=${l.color} fill-opacity=${l.opacity} />`:m}
          <g data-design-box transform="scale(${r.scale*v})">
            ${e.elements.map(D=>ii(D,a,t))}
          </g>
        </g>
        <circle cx=${f/2} cy=${f/2} r=${f/2} fill="none"
          stroke="rgba(255,255,255,0.22)" stroke-width=${.75*g} stroke-dasharray=${`${2*g} ${2*g}`} />
        ${H}
      </g>`}return k`<svg viewBox=${`0 0 ${$.quad.width} ${$.quad.height}`} xmlns="http://www.w3.org/2000/svg" class="complication corner"
        width=${$.quad.width} height=${$.quad.height}>
      <defs><clipPath id=${o}><circle cx=${f/2} cy=${f/2} r=${f/2} /></clipPath></defs>
      <path d=${M} fill="#000000" />
      ${P}
      ${C}
    </svg>`}let c=k`<rect width=${i.width} height=${i.height} />`,p=s?k`<rect x=${d/2} y=${d/2} width=${i.width-d} height=${i.height-d} fill="none" stroke=${s.color} stroke-opacity=${s.opacity} stroke-width=${d} />`:m,h=k`<rect width=${i.width} height=${i.height} fill="#000000" />`,y=`0 0 ${i.width} ${i.height}`;return k`<svg viewBox=${y} xmlns="http://www.w3.org/2000/svg" class="complication ${n}"
      width=${i.width} height=${i.height}>
    <defs><clipPath id=${o}>${c}</clipPath></defs>
    <g clip-path=${`url(#${o})`}>
      ${h}
      ${l?k`<rect width=${i.width} height=${i.height} fill=${l.color} fill-opacity=${l.opacity} />`:m}
      <g data-design-box transform="translate(${r.x} ${r.y}) scale(${r.scale})">
        ${e.elements.map(g=>ii(g,a,t))}
      </g>
    </g>
    ${p}
  </svg>`}var Fs=.14;function Rs(e,t){let n=Ka(e,t);if(e.kind!=="text"||e.text==="")return n;let i=Math.min(n.w,Math.max(e.fontSize,e.text.length*e.fontSize*.55)),a=Math.min(n.h,e.fontSize*1.3);return{x:n.cx-i/2,y:n.cy-a/2,w:i,h:a,cx:n.cx,cy:n.cy}}function Is(e,t,n){let i=e.family in ae?e.family:"rectangular",a=ae[i],r=e.elements.filter(h=>t.includes(h.id)),o=1/0,l=1/0,s=-1/0,d=-1/0;for(let h of r){let y=Rs(h,a),g=h.frame.rotationDegrees%180===0?0:Math.hypot(y.w,y.h)/2;o=Math.min(o,g?y.cx-g:y.x),l=Math.min(l,g?y.cy-g:y.y),s=Math.max(s,g?y.cx+g:y.x+y.w),d=Math.max(d,g?y.cy+g:y.y+y.h)}let c=s-o,p=d-l;if(r.length===0||!(c>0)||!(p>0))o=0,l=0,c=a.width,p=a.height;else{let h=Math.max(2,Math.max(c,p)*Fs);o-=h,l-=h,c+=2*h,p+=2*h}if(c/p<n){let h=p*n;o-=(h-c)/2,c=h}else{let h=c/n;l-=(h-p)/2,p=h}return{x:o,y:l,w:c,h:p}}function qa(e,t,n){let i=e.family in ae?e.family:"rectangular",a=ae[i],r=Is(e,t,n.width/n.height),o=ke(e.backgroundColorHex),l=ke(e.borderColorHex),s=e.borderWidth,d={icons:n.icons,showHidden:!0,tapAreas:!0,...n.imageSizes?{imageSizes:n.imageSizes}:{}},c=e.elements.filter(y=>t.includes(y.id)),p=l&&s>0?i==="rectangular"?k`<rect x=${s/2} y=${s/2} width=${a.width-s} height=${a.height-s} fill="none" stroke=${l.color} stroke-opacity=${l.opacity} stroke-width=${s} />`:k`<circle cx=${a.width/2} cy=${a.height/2} r=${a.width/2-s/2} fill="none" stroke=${l.color} stroke-opacity=${l.opacity} stroke-width=${s} />`:m,h=i==="rectangular"?k`<rect width=${a.width} height=${a.height} fill=${o?o.color:"#000000"} fill-opacity=${o?o.opacity:1} />`:k`<circle cx=${a.width/2} cy=${a.height/2} r=${a.width/2} fill=${o?o.color:"#000000"} fill-opacity=${o?o.opacity:1} />`;return k`<svg viewBox=${`${r.x} ${r.y} ${r.w} ${r.h}`} xmlns="http://www.w3.org/2000/svg" class="thumb ${i}"
      width=${n.width} height=${n.height} preserveAspectRatio="xMidYMid meet" aria-hidden="true">
    <rect x=${r.x} y=${r.y} width=${r.w} height=${r.h} fill="#000000" />
    ${h}
    ${c.map(y=>ii(y,a,d))}
    ${p}
  </svg>`}function O(e){switch(e){case"rectangular":return"Rectangular";case"circular":return"Circular";case"corner":return"Corner";case"inline":return"Inline"}}var at=["rectangular","circular","corner","inline"];function Rt(e){return X.includes(e)}function Ya(e){return at.filter(t=>e.supportedFamilies.includes(t))}function Ja(e){return X.find(t=>e.supportedFamilies.includes(t))}function rt(e,t){return e.supportedFamilies.includes(t)&&e.supportedFamilies.length>1}function As(e){let t=e.elements.find(i=>i.kind==="text");return{value:t&&t.kind==="text"?structuredClone(t.payload.value):E("Text")}}function Xa(e,t){e.supportedFamilies.includes(t)||(e.supportedFamilies=at.filter(n=>n===t||e.supportedFamilies.includes(n))),Rt(t)?e.perFamily[t]||(e.perFamily[t]=Vn()):e.inline||(e.inline=As(e)),e.schemaVersion=wt(e)}function Za(e,t){rt(e,t)&&(e.supportedFamilies=e.supportedFamilies.filter(n=>n!==t),Rt(t)?delete e.perFamily[t]:delete e.inline,e.schemaVersion=wt(e))}function Qa(e,t){let n=[];if(!Rt(t)){let r=e.inline;return r&&(r.value.kind.kind==="literal"&&(r.value.kind.value===""||r.value.kind.value==="Text")&&!r.label&&!r.symbol||n.push("the Inline text")),n}let i=e.perFamily[t];if(!i)return n;let a=Object.keys(i.placements).length;return a>0&&n.push(`${a} placement${a===1?"":"s"}`),i.rules.length>0&&n.push(`${i.rules.length} rule${i.rules.length===1?"":"s"}`),(i.bezelText||i.bezelGauge)&&n.push("the bezel"),i.curvedText&&n.push("the curved text"),(i.backgroundColorHex||i.borderColorHex)&&n.push("the background or border"),n}var Q={text:"#42a5f5",icon:"#ab47bc",gauge:"#fb8c00",shape:"#43a047",image:"#00acc1",tap:"#ec407a"},ot={text:"Text",icon:"Icon",gauge:"Gauge",shape:"Shape",image:"Picture",tap:"Tap area"},er=["text","icon","gauge","shape","image","tap"],U={states:"#f9a825",tap:Q.tap,place:"#78909c",complication:"#5c6bc0",group:"#90a4ae",locked:"#e53935"};var tr="2.8.0";function di(e){if(typeof e!="string")return;let t=/^\s*v?(\d+)\.(\d+)(?:\.(\d+))?/.exec(e);if(t)return[Number(t[1]),Number(t[2]),Number(t[3]??0)]}function Ms(e,t){for(let n=0;n<3;n++)if(e[n]!==t[n])return e[n]<t[n]?-1:1;return 0}function nr(e,t=tr){let n=di(e),i=di(t);return!n||!i?!1:Ms(n,i)>=0}function ir(e,t=tr){return`${di(e)?`This watch runs Wrist Assistant ${e}.`:"This watch has not reported its Wrist Assistant version yet."} The complication editor needs ${t} or newer. Update Wrist Assistant on the watch, open it once so it reports its version, then reload this page.`}var ar="52a9d81d0fd7";function Ls(e){return e.trim().replace(/\./g,"-")}function zs(e){return e.trim().replace(/-/g,".")}var an=class e{constructor(t){this.onReady=t;this.cache=new Map;this.pending=new Set;this.nameList=[];this.nameState="idle"}static available(){return typeof window<"u"&&!!window.customIcons?.ios}available(){return e.available()}names(){return this.nameState==="idle"&&this.fetchNames(),this.nameState==="loaded"?this.nameList:void 0}fetchNames(){this.nameState="loading";let t=window.customIcons?.ios;if(!t||typeof t.getIconList!="function"){this.nameState="loaded";return}Promise.resolve().then(()=>t.getIconList()).then(n=>{this.nameList=(n??[]).map(i=>zs(i.name)).sort()}).catch(()=>{this.nameList=[]}).finally(()=>{this.nameState="loaded",this.onReady()})}render(t,n,i){let a=Ls(t),r=this.cache.get(a);if(r===void 0){this.fetch(a);return}if(r===null||!r.path)return;let o=ke(i)??{color:"#FFFFFF",opacity:1},l=r.viewBox??"0 0 24 24";return k`<svg x="0" y="0" width=${n} height=${n} viewBox=${l}>
      <path d=${r.path} fill=${o.color} fill-opacity=${o.opacity} /></svg>`}fetch(t){if(this.pending.has(t))return;let n=window.customIcons?.ios;if(!n){this.cache.set(t,null);return}this.pending.add(t),Promise.resolve().then(()=>n.getIcon(t)).then(i=>this.cache.set(t,i&&i.path?i:null)).catch(()=>this.cache.set(t,null)).finally(()=>{this.pending.delete(t),this.onReady()})}},ci=class{constructor(t){this.onReady=t;this.icons=new Map;this.state="idle"}available(){return this.state!=="loaded"||this.icons.size>0}names(){return this.load(),this.state==="loaded"?[...this.icons.keys()].sort():void 0}render(t,n,i){this.load();let a=this.icons.get(t.trim());if(!a)return;let r=ke(i)??{color:"#FFFFFF",opacity:1};return k`<svg x="0" y="0" width=${n} height=${n} viewBox=${a[1]}>
      <path d=${a[0]} fill=${r.color} fill-opacity=${r.opacity} /></svg>`}load(){if(this.state!=="idle")return;this.state="loading";let t=new URL(`symbol-icons.json.gz?v=${ar}`,import.meta.url);fetch(t).then(n=>{if(!n.ok||!n.body)throw new Error(`symbol file: ${n.status}`);return new Response(n.body.pipeThrough(new DecompressionStream("gzip"))).json()}).then(n=>{if(n&&typeof n=="object")for(let[i,a]of Object.entries(n))Array.isArray(a)&&typeof a[0]=="string"&&typeof a[1]=="string"&&this.icons.set(i,[a[0],a[1]])}).catch(()=>{}).finally(()=>{this.state="loaded",this.onReady()})}};function rr(e){return an.available()?new an(e):new ci(e)}function or(e){let t=new Map,n=new Set;return{size(i){let a=t.get(i);if(a)return a;if(n.has(i))return;n.add(i);let r=new Image;r.onload=()=>{r.naturalWidth<=0||r.naturalHeight<=0||(t.set(i,{width:r.naturalWidth,height:r.naturalHeight}),e())},r.src=i}}}var on=[{name:"Home",symbols:["house","house.fill","house.circle.fill","bed.double.fill","sofa.fill","chair.lounge.fill","lamp.desk.fill","washer.fill","dryer.fill","refrigerator.fill","oven.fill","dishwasher.fill","microwave.fill","shower.fill","bathtub.fill","toilet.fill","stairs","door.left.hand.open","door.left.hand.closed","window.casement","curtains.closed","spigot.fill","humidifier.fill","air.purifier.fill","fan.fill","fan.ceiling.fill"]},{name:"Climate",symbols:["thermometer.variable","thermometer.medium","thermometer.low","thermometer.high","thermometer.sun.fill","thermometer.snowflake","humidity.fill","drop.fill","drop.degreesign","flame.fill","snowflake","wind","air.conditioner.horizontal.fill","heater.vertical.fill","gauge.with.needle"]},{name:"Weather",symbols:["sun.max.fill","sun.min.fill","sunrise.fill","sunset.fill","moon.fill","moon.stars.fill","cloud.fill","cloud.sun.fill","cloud.rain.fill","cloud.heavyrain.fill","cloud.drizzle.fill","cloud.snow.fill","cloud.bolt.fill","cloud.bolt.rain.fill","cloud.fog.fill","tornado","hurricane","umbrella.fill","rainbow","aqi.medium"]},{name:"Lighting",symbols:["lightbulb","lightbulb.fill","lightbulb.slash.fill","lightbulb.led.fill","light.recessed","light.panel.fill","light.strip.2","lamp.ceiling.fill","lamp.floor.fill","lamp.table.fill","sparkles","rays"]},{name:"Security",symbols:["lock.fill","lock.open.fill","lock.shield.fill","shield.fill","shield.slash.fill","key.fill","exclamationmark.shield.fill","video.fill","video.slash.fill","web.camera.fill","sensor.fill","sensor.tag.radiowaves.forward.fill","bell.fill","bell.slash.fill","bell.badge.fill","alarm.fill","eye.fill","eye.slash.fill"]},{name:"Media",symbols:["play.fill","pause.fill","stop.fill","forward.fill","backward.fill","forward.end.fill","backward.end.fill","speaker.wave.2.fill","speaker.wave.3.fill","speaker.slash.fill","music.note","music.note.list","tv","tv.fill","appletv.fill","homepod.fill","homepod.2.fill","airplay.audio","airplay.video","hifispeaker.fill","headphones","radio.fill","film.fill","photo.fill"]},{name:"Power",symbols:["bolt.fill","bolt.slash.fill","bolt.circle.fill","battery.100percent","battery.75percent","battery.50percent","battery.25percent","battery.0percent","battery.100percent.bolt","powerplug.fill","power","poweroutlet.type.b.fill","minus.plus.batteryblock.fill","leaf.fill"]},{name:"Devices",symbols:["iphone","ipad","applewatch","macbook","desktopcomputer","laptopcomputer","homekit","wifi","wifi.slash","antenna.radiowaves.left.and.right","network","externaldrive.fill","server.rack","printer.fill","cpu","memorychip","sdcard.fill","cable.connector","dot.radiowaves.left.and.right"]},{name:"Status",symbols:["checkmark","checkmark.circle.fill","xmark","xmark.circle.fill","exclamationmark.triangle.fill","exclamationmark.circle.fill","questionmark.circle.fill","info.circle.fill","circle.fill","circle","circle.circle.fill","minus.circle.fill","plus.circle.fill","hand.thumbsup.fill","hand.thumbsdown.fill","star.fill","heart.fill","flag.fill","pin.fill","wrench.and.screwdriver.fill","gearshape.fill","hourglass","ellipsis"]},{name:"Time",symbols:["clock","clock.fill","alarm","timer","stopwatch.fill","calendar","calendar.badge.clock","hourglass.bottomhalf.filled","deskclock.fill","sunrise","sunset","moon.zzz.fill","zzz"]},{name:"Arrows",symbols:["arrow.up","arrow.down","arrow.left","arrow.right","arrow.up.right","arrow.down.right","arrow.up.circle.fill","arrow.down.circle.fill","arrow.clockwise","arrow.counterclockwise","arrow.up.arrow.down","arrow.up.and.down","arrow.left.and.right","arrowshape.turn.up.left.fill","chevron.up","chevron.down","chevron.left","chevron.right"]},{name:"Shapes",symbols:["square.fill","square","circle.dashed","triangle.fill","diamond.fill","hexagon.fill","octagon.fill","capsule.fill","rectangle.fill","app.fill","seal.fill","shield","oval.fill","pentagon.fill","rhombus.fill","drop","cloud","bolt"]},{name:"Text and numbers",symbols:["0.circle.fill","1.circle.fill","2.circle.fill","3.circle.fill","textformat","textformat.size","percent","number","plus","minus","multiply","divide","equal","function","sum","character","character.textbox","degreesign.celsius","degreesign.fahrenheit"]},{name:"Nature",symbols:["tree.fill","carrot.fill","drop.triangle.fill","pawprint.fill","hare.fill","tortoise.fill","ant.fill","ladybug.fill","bird.fill","fish.fill","camera.macro","mountain.2.fill","water.waves","globe.americas.fill"]},{name:"People",symbols:["person.fill","person.2.fill","person.3.fill","person.crop.circle.fill","person.fill.checkmark","person.fill.xmark","figure.walk","figure.run","figure.stand","hand.raised.fill","ear.fill","brain.head.profile","eye","accessibility"]},{name:"Transport",symbols:["car.fill","car.2.fill","bus.fill","tram.fill","airplane","bicycle","figure.walk.motion","ev.charger.fill","fuelpump.fill","parkingsign.circle.fill","road.lanes","location.fill","location.slash.fill","map.fill","mappin.and.ellipse"]}],sn=[...new Set(on.flatMap(e=>e.symbols))],_s={"aqi.medium":["air quality"],"arrow.clockwise":["refresh","reload","update"],"battery.100percent":["charge","level"],"bolt.fill":["power","energy","watt","electric"],"checkmark.circle.fill":["ok","done","good"],"clock.fill":["time"],"curtains.closed":["blind","shade","cover"],"door.left.hand.open":["entry"],"drop.fill":["humidity","water","moisture"],"dryer.fill":["laundry"],"exclamationmark.triangle.fill":["alert","alarm","problem","error"],"fan.fill":["ventilation"],"figure.walk":["motion","presence"],"flame.fill":["heat","heating","boiler","fire"],"gauge.with.needle":["pressure"],"gearshape.fill":["settings","config"],"house.fill":["home"],"leaf.fill":["eco","plant","garden"],"lock.fill":["security","locked","secure"],"moon.fill":["night","sleep"],"person.fill":["presence","occupancy"],"poweroutlet.type.b.fill":["socket","outlet"],"powerplug.fill":["outlet","socket","plug","switch"],"sensor.tag.radiowaves.forward.fill":["motion"],snowflake:["cool","cooling","ac","freeze"],"speaker.wave.2.fill":["volume","sound","audio"],"sun.max.fill":["day","bright","brightness"],"thermometer.medium":["temperature","temp"],"video.fill":["camera"],"washer.fill":["laundry"],"water.waves":["pool","flood"],wifi:["network","internet","signal"],"window.casement":["blind","shade"]};function Hs(e){return`${e.replace(/\./g," ")} ${(_s[e]??[]).join(" ")}`}function sr(e,t){let n=t.toLowerCase().split(/[\s.]+/).filter(Boolean);if(n.length===0)return[...e];let i=[];for(let a of e){let r=Hs(a);if(!n.every(l=>r.includes(l)))continue;let o=n.join(".");i.push({name:a,score:a===o?0:a.startsWith(o)?1:2})}return i.sort((a,r)=>a.score-r.score).map(a=>a.name)}var rn=class e{constructor(t){this.onChange=t;this.collapsed=new Set;this.browsing=new Map;this.recent=[];this.recent=e.loadRecent()}static{this.STORAGE_KEY="wrist-assistant.recent-symbols"}static{this.RECENT_LIMIT=12}isOpen(t){return!this.collapsed.has(t)}toggle(t){this.collapsed.has(t)?this.collapsed.delete(t):this.collapsed.add(t),this.onChange()}query(t){return this.browsing.get(t)?.query??""}category(t){return this.browsing.get(t)?.category??""}setQuery(t,n){this.browsing.set(t,{category:this.category(t),query:n}),this.onChange()}setCategory(t,n){this.browsing.set(t,{query:this.query(t),category:n}),this.onChange()}noteUsed(t){let n=t.trim();n&&(this.recent=[n,...this.recent.filter(i=>i!==n)].slice(0,e.RECENT_LIMIT),e.saveRecent(this.recent),this.onChange())}static loadRecent(){try{let t=localStorage.getItem(e.STORAGE_KEY),n=t?JSON.parse(t):[];return Array.isArray(n)?n.filter(i=>typeof i=="string").slice(0,e.RECENT_LIMIT):[]}catch{return[]}}static saveRecent(t){try{localStorage.setItem(e.STORAGE_KEY,JSON.stringify(t))}catch{}}};var Ps=100;function lr(e){return e.error!==void 0&&e.error!==""?{tone:"err",text:`Not saved: ${e.error}`}:e.templateError!==void 0&&e.templateError!==""?{tone:"err",text:`Template error: ${e.templateError}`}:e.dirty?{tone:"warn",text:"Unsaved changes"}:e.revision===null?{tone:"warn",text:"Not saved yet"}:{tone:"ok",text:`Saved, revision ${e.revision}`}}var qe=class e{constructor(t,n){this.config=t;this.past=[];this.future=[];this.coalesceUntil=0;this.baseRevision=n,Ke(t),this.baseline=JSON.stringify(Ut(t))}static fromDocument(t,n){return new e(ga(t),n)}get dirty(){return JSON.stringify(Ut(this.config))!==this.baseline}get canUndo(){return this.past.length>0}get canRedo(){return this.future.length>0}update(t,n){let i=Date.now();n!==void 0&&n===this.coalesceKey&&i<this.coalesceUntil||(this.past.push(structuredClone(this.config)),this.past.length>Ps&&this.past.shift(),this.future=[]),this.coalesceKey=n,this.coalesceUntil=n===void 0?0:i+800;let r=structuredClone(this.config);t(r),Ke(r),this.config=r}endGesture(){this.coalesceKey=void 0,this.coalesceUntil=0}undo(){let t=this.past.pop();t&&(this.future.push(this.config),this.config=t,this.endGesture())}redo(){let t=this.future.pop();t&&(this.past.push(this.config),this.config=t,this.endGesture())}encoded(){let t=structuredClone(this.config);return t.dataSources=Qn(t),Ut(t)}commit(){let t=structuredClone(this.config);return t.dataSources=Qn(t),new e(t,null)}};var st={isOn:"is on",isOff:"is off",equals:"equals",notEquals:"does not equal",isUnavailable:"is unavailable or unknown",isStale:"data is stale",isEmpty:"is empty",greaterThan:"is greater than",greaterOrEqual:"is at least",lessThan:"is less than",lessOrEqual:"is at most",between:"is between",contains:"contains",startsWith:"starts with",endsWith:"ends with",matchesRegex:"matches regex",isOneOf:"is one of"},Re={icon:"Icon",text:"Text",color:"Colour",visibility:"Visible",opacity:"Opacity",fontSize:"Size",fontWeight:"Weight",rotation:"Rotation",gaugeValue:"Gauge value",gaugeMin:"Gauge min",gaugeMax:"Gauge max",backgroundColor:"Background",borderColor:"Border colour",borderWidth:"Border width"},cr=["icon","text","color","visibility","opacity","fontSize","fontWeight","rotation","gaugeValue","gaugeMin","gaugeMax","backgroundColor","borderColor","borderWidth"],pr={color:"setColor",opacity:"setOpacity",text:"setText",icon:"setIcon",fontSize:"setFontSize",fontWeight:"setFontWeight",rotation:"setRotation",visibility:"hide",gaugeValue:"setGaugeValue",gaugeMin:"setGaugeMin",gaugeMax:"setGaugeMax",borderColor:"setBorderColor",borderWidth:"setBorderWidth",backgroundColor:"setBackgroundColor"},pi=["isOn","isOff","equals","notEquals","isUnavailable","isStale","isEmpty","lessThan","lessOrEqual","between","greaterOrEqual","greaterThan","contains","startsWith","endsWith"],Ns=["lessThan","lessOrEqual","between","greaterOrEqual","greaterThan"];function ui(e){return Ns.includes(e)}function Os(e){return pi.includes(e)}function Vs(e,t){return JSON.stringify(J(e))===JSON.stringify(J(t))}function hi(e){if(e.length>1)return{ok:!1,reason:`There are ${e.length} rules here. A table shows one.`};let t=e[0];if(!t)return{ok:!0,table:{ruleId:"",rows:[],columns:[],numberMode:!1}};let n,i=[];for(let[r,o]of t.cases.entries()){let l=o.when.tests;if(l.length!==1)return{ok:!1,reason:l.length===0?`State ${r+1} checks nothing, so it always matches.`:`State ${r+1} checks ${l.length} things at once. A table row checks one.`};let s=l[0];if(!Os(s.comparison.kind))return{ok:!1,reason:`State ${r+1} uses "${st[s.comparison.kind]}", which a table row cannot show.`};if(n===void 0)n=s.value;else if(!Vs(n,s.value))return{ok:!1,reason:"The states test different values. A table tests one value in every row."};let d=dr(o.then);if(d)return{ok:!1,reason:`State ${r+1} sets ${Re[d]} twice. A table has one cell per column.`};i.push({caseId:o.id,testId:s.id,join:o.when.join,comparison:s.comparison,changes:o.then})}if(t.otherwise){let r=dr(t.otherwise);if(r)return{ok:!1,reason:`Otherwise sets ${Re[r]} twice. A table has one cell per column.`}}let a={ruleId:t.id,rows:i,columns:Ds(i,t.otherwise),numberMode:i.length>0&&i.every(r=>ui(r.comparison.kind))};return n!==void 0&&(a.value=n),t.otherwise&&(a.otherwise=t.otherwise),{ok:!0,table:a}}function dr(e){let t=new Set;for(let n of e){let i=le[n.kind];if(t.has(i))return i;t.add(i)}}function Ds(e,t){let n=new Set;for(let i of e)for(let a of i.changes)n.add(le[a.kind]);for(let i of t??[])n.add(le[i.kind]);return cr.filter(i=>n.has(i))}function ur(e,t,n){let i=new Set(e);for(let a of t)i.add(a);return cr.filter(a=>i.has(a)&&n.includes(a))}function ln(e,t){return e.find(n=>le[n.kind]===t)}function hr(e,t,n,i){let a=t.map(o=>({id:o.caseId??q(),when:{join:o.join??"all",tests:[{id:o.testId??q(),value:structuredClone(e),comparison:o.comparison}]},then:o.changes})),r={id:i??q(),cases:a};return n&&(r.otherwise=n),r}function It(e){if(e.length===0)return"No states yet.";let t=hi(e);if(!t.ok)return"Advanced rules.";let n=t.table.rows.length+(t.table.otherwise?1:0);return n===1?"1 state.":`${n} states.`}function mr(e){let t=e[0];return t||(t={id:q(),cases:[]},e.push(t)),t}function fr(e){let t=e[0];t&&t.cases.length===0&&t.otherwise===void 0&&(e.length=0)}function gr(e,t,n){let i=mr(e),a=i.cases[i.cases.length-1]?.when.tests[0]?.comparison;i.cases.push({id:q(),when:{join:"all",tests:[{id:q(),value:structuredClone(t),comparison:Gs(a,n)}]},then:[]})}function yr(e,t){let n=e[0];n&&(n.cases=n.cases.filter(i=>i.id!==t),fr(e))}function mi(e,t,n){let i=e[0]?.cases;if(!i||n<0||n>=i.length)return;let[a]=i.splice(t,1);a&&i.splice(n,0,a)}function fi(e,t){if(t){mr(e).otherwise=[];return}let n=e[0];n&&(delete n.otherwise,fr(e))}function vr(e,t){for(let n of e[0]?.cases??[]){let i=n.when.tests[0];i&&(i.value=structuredClone(t))}}function br(e,t){let n=e[0];if(!n)return;let i=a=>a.filter(r=>le[r.kind]!==t);for(let a of n.cases)a.then=i(a.then);n.otherwise&&(n.otherwise=i(n.otherwise))}function Bs(e){return e?e.kind.kind==="literal"?e.kind.value===""?"?":e.kind.value:"a value":"?"}function wr(e,t=Bs){let n=()=>t(e.value??E(""));switch(e.kind){case"lessThan":return`below ${n()}`;case"lessOrEqual":return`${n()} or below`;case"greaterThan":return`above ${n()}`;case"greaterOrEqual":return`${n()} or above`;case"between":return`${n()} to ${t(e.upper??E(""))}`;case"matchesRegex":return`matches ${e.pattern||"?"}`;case"isOneOf":return`is one of ${(e.options??[]).join(", ")||"?"}`;default:return We(e.kind)==="value"?`${st[e.kind]} ${n()}`:st[e.kind]}}function Gs(e,t){if(!e)return t?{kind:"lessThan",value:E("20")}:{kind:"isOn"};switch(e.kind){case"isOn":return{kind:"isOff"};case"isOff":return{kind:"isOn"};case"lessThan":case"lessOrEqual":return{kind:"greaterOrEqual",value:e.value??E("0")};case"between":return{kind:"greaterOrEqual",value:e.upper??E("0")};case"greaterThan":case"greaterOrEqual":return{kind:"greaterOrEqual",value:e.value??E("0")};default:return{kind:e.kind,...We(e.kind)==="value"?{value:E("")}:{}}}}var xr={text:"text",icon:"icon",gauge:"color",shape:"color",image:"visibility",tap:"visibility",layout:"backgroundColor"};function $r(e){if(!e)return!1;let t=e.kind;if(t.kind!=="entityState")return!1;let n=t.domain||t.entityId.split(".")[0]||"";return["light","switch","fan","input_boolean","binary_sensor","automation","siren","humidifier","group"].includes(n)}function Us(e){switch(e){case"text":return k`<path d="M5 6H19M12 6V19M9 19H15" />`;case"icon":return k`<path d="M12 3.5L14.6 9L20.5 9.7L16.1 13.8L17.3 19.7L12 16.8L6.7 19.7L7.9 13.8L3.5 9.7L9.4 9Z" />`;case"gauge":return k`<path d="M5 17A8 8 0 1 1 19 17" /><path d="M12 13L15.5 9.5" /><circle cx="12" cy="13" r="1.4" />`;case"shape":return k`<rect x="4" y="5" width="16" height="14" rx="3" />`;case"image":return k`<rect x="3.5" y="5" width="17" height="14" rx="2.5" /><circle cx="9" cy="10" r="1.6" /><path d="M20.5 15.5L15.5 11L7 19" />`;case"tap":return k`<path d="M10 12V5.5a1.8 1.8 0 0 1 3.6 0V12" /><path d="M13.6 10.5a1.8 1.8 0 0 1 3.6 0V13" /><path d="M10 11.5a1.8 1.8 0 0 0-3.6 0v3.5a6.6 6.6 0 0 0 13.2 0v-1.5" />`;case"content":return k`<rect x="3.5" y="5" width="17" height="14" rx="2.5" /><path d="M7 9.5H17M7 13H13" />`;case"look":return k`<circle cx="12" cy="12" r="8.5" /><circle cx="8.5" cy="10.5" r="1.1" /><circle cx="12" cy="8" r="1.1" /><circle cx="15.5" cy="10.5" r="1.1" /><path d="M12 20.5a2.5 2.5 0 0 0 0-5h-1a1.8 1.8 0 0 1 0-3.6" />`;case"clock":return k`<circle cx="12" cy="12" r="8.5" /><path d="M12 7.5V12L15 14" />`;case"states":return k`<path d="M6 4V9.5A2.5 2.5 0 0 0 8.5 12H15.5A2.5 2.5 0 0 1 18 14.5V20" /><circle cx="6" cy="4" r="1.4" /><circle cx="18" cy="20" r="1.4" /><path d="M6 20V14" />`;case"place":return k`<path d="M12 3V6.5M12 17.5V21M3 12H6.5M17.5 12H21" /><circle cx="12" cy="12" r="4.5" />`;case"layers":return k`<path d="M12 4L20 8.5L12 13L4 8.5Z" /><path d="M4 12.5L12 17L20 12.5" /><path d="M4 16.5L12 21L20 16.5" />`;case"grip":return k`<circle cx="9" cy="6" r="1.3" /><circle cx="15" cy="6" r="1.3" /><circle cx="9" cy="12" r="1.3" /><circle cx="15" cy="12" r="1.3" /><circle cx="9" cy="18" r="1.3" /><circle cx="15" cy="18" r="1.3" />`;case"chevron":return k`<path d="M6 9L12 15L18 9" />`;case"plus":return k`<path d="M12 5V19M5 12H19" />`;case"watch":return k`<rect x="6" y="6.5" width="12" height="11" rx="3" /><path d="M9 6.5L9.6 3H14.4L15 6.5M9 17.5L9.6 21H14.4L15 17.5" />`;case"lock":return k`<rect x="5" y="11" width="14" height="10" rx="2" /><path d="M8 11V7.5a4 4 0 0 1 8 0V11" />`;case"unlock":return k`<rect x="5" y="11" width="14" height="10" rx="2" /><path d="M8 11V7.5a4 4 0 0 1 7.6-1.7" />`;case"folder":return k`<path d="M3.5 7.5A2 2 0 0 1 5.5 5.5H9.5L11.5 7.5H18.5A2 2 0 0 1 20.5 9.5V17A2 2 0 0 1 18.5 19H5.5A2 2 0 0 1 3.5 17Z" />`;case"ungroup":return k`<path d="M3.5 7.5A2 2 0 0 1 5.5 5.5H9.5L11.5 7.5H18.5A2 2 0 0 1 20.5 9.5V17A2 2 0 0 1 18.5 19H5.5A2 2 0 0 1 3.5 17Z" /><path d="M9 13.5H15" />`;case"up":return k`<path d="M6 14L12 8L18 14" />`;case"down":return k`<path d="M6 10L12 16L18 10" />`;case"show":return k`<path d="M2.5 12C5.5 7 8.7 5.5 12 5.5C15.3 5.5 18.5 7 21.5 12C18.5 17 15.3 18.5 12 18.5C8.7 18.5 5.5 17 2.5 12Z" />
        <circle cx="12" cy="12" r="2.8" />`;case"hide":return k`<path d="M2.5 12C5.5 7 8.7 5.5 12 5.5C15.3 5.5 18.5 7 21.5 12C18.5 17 15.3 18.5 12 18.5C8.7 18.5 5.5 17 2.5 12Z" />
        <circle cx="12" cy="12" r="2.8" />
        <path d="M4 20L20 4" />`;case"duplicate":return k`<rect x="9" y="9" width="12" height="12" rx="2.5" />
        <path d="M15 9V5.5A2.5 2.5 0 0 0 12.5 3H5.5A2.5 2.5 0 0 0 3 5.5V12.5A2.5 2.5 0 0 0 5.5 15H9" />`;case"delete":return k`<path d="M4.5 7H19.5" />
        <path d="M9.5 7V4.5H14.5V7" />
        <path d="M6.5 7L7.4 19.6A1.5 1.5 0 0 0 8.9 21H15.1A1.5 1.5 0 0 0 16.6 19.6L17.5 7" />
        <path d="M10.2 11V17M13.8 11V17" />`;case"close":return k`<path d="M6.5 6.5L17.5 17.5M17.5 6.5L6.5 17.5" />`;case"reset":return k`<path d="M4.5 12A7.5 7.5 0 1 0 7 6.4" />
        <path d="M4 3.5V7H7.5" />`}}function z(e){return u`<svg class="ui-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${Us(e)}</svg>`}function lt(e,t){let n=new DOMPoint(t.clientX,t.clientY),i=e.getScreenCTM();if(!i)return{x:0,y:0};let a=n.matrixTransform(i.inverse());return{x:a.x,y:a.y}}function kr(e){let t=Math.min(.96,Math.max(-e.width+.04,e.x)),n=Math.min(1-.04,Math.max(-e.height+.04,e.y));return{...e,x:t,y:n}}var dn=e=>Math.round(e*1e3)/1e3,Cr=10;function gi(e,t,n,i){let a=i.width>0?e.x+t/i.width:e.x,r=i.height>0?e.y+n/i.height:e.y;return kr({...e,x:dn(a),y:dn(r)})}function Sr(e,t,n,i){let a=r=>Math.min(1,Math.max(0,r));return{x:i.w>0?dn(a(e.x+t/i.w)):e.x,y:i.h>0?dn(a(e.y+n/i.h)):e.y}}function cn(e,t,n,i,a){let r=lt(e,n),o={...i.frame},l=o;e.setPointerCapture(n.pointerId);let s=h=>Math.round(h*1e3)/1e3,d=h=>{if(h.pointerId!==n.pointerId)return;let y=lt(e,h),g=(y.x-r.x)/t.width,x=(y.y-r.y)/t.height,w;if(!i.handle)w=kr({...o,x:s(o.x+g),y:s(o.y+x)});else{let{x:T,y:$,width:f,height:v}=o,b=o.x+o.width,F=o.y+o.height;i.handle.includes("e")&&(f=Math.max(.04,o.width+g)),i.handle.includes("s")&&(v=Math.max(.04,o.height+x)),i.handle.includes("w")&&(f=Math.max(.04,o.width-g),T=b-f),i.handle.includes("n")&&(v=Math.max(.04,o.height-x),$=F-v),w={...o,x:s(T),y:s($),width:s(f),height:s(v)}}l=w,a.onFrame(i.elementId,w,!1)},c=h=>{h.pointerId===n.pointerId&&(p(),a.onFrame(i.elementId,l,!0))},p=()=>{e.removeEventListener("pointermove",d),e.removeEventListener("pointerup",c),e.removeEventListener("pointercancel",c);try{e.releasePointerCapture(n.pointerId)}catch{}};return e.addEventListener("pointermove",d),e.addEventListener("pointerup",c),e.addEventListener("pointercancel",c),p}function Er(e,t,n,i,a){let r=lt(e,n),o=i;e.setPointerCapture(n.pointerId);let l=h=>Math.round(h*1e3)/1e3,s=h=>Math.min(1,Math.max(0,h)),d=h=>{if(h.pointerId!==n.pointerId)return;let y=lt(e,h),g=t.w>0?s(i.x+(y.x-r.x)/t.w):i.x,x=t.h>0?s(i.y+(y.y-r.y)/t.h):i.y;o={x:l(g),y:l(x)},a(o.x,o.y,!1)},c=h=>{h.pointerId===n.pointerId&&(p(),a(o.x,o.y,!0))},p=()=>{e.removeEventListener("pointermove",d),e.removeEventListener("pointerup",c),e.removeEventListener("pointercancel",c);try{e.releasePointerCapture(n.pointerId)}catch{}};return e.addEventListener("pointermove",d),e.addEventListener("pointerup",c),e.addEventListener("pointercancel",c),p}function Tr(e,t,n,i,a){let r=lt(e,t),o=1;e.setPointerCapture(t.pointerId);let l=c=>{if(c.pointerId!==t.pointerId)return;let p=lt(e,c),h=(p.x-r.x)*(n.includes("e")?1:-1),y=(p.y-r.y)*(n.includes("s")?1:-1),g=i.w>0?(i.w+h)/i.w:1,x=i.h>0?(i.h+y)/i.h:1,w=Math.abs(g-1)>=Math.abs(x-1)?g:x;o=Math.max(.05,w),a(o,!1)},s=c=>{c.pointerId===t.pointerId&&(d(),a(o,!0))},d=()=>{e.removeEventListener("pointermove",l),e.removeEventListener("pointerup",s),e.removeEventListener("pointercancel",s);try{e.releasePointerCapture(t.pointerId)}catch{}};return e.addEventListener("pointermove",l),e.addEventListener("pointerup",s),e.addEventListener("pointercancel",s),d}var xi=["content","look","timestamp","tappable","states","placement","corner","placements","shape","symbol"];function ie(e){return t=>e(t.target.value)}function ee(e,t,n,i={}){return u`<label class="field"><span>${e}</span>
    <input type="text" .value=${t} placeholder=${i.placeholder??""} list=${i.list??m}
      class=${i.mono?"mono":""} @input=${ie(n)} /></label>`}function Ks(e,t,n,i=3){return u`<label class="field"><span>${e}</span>
    <textarea rows=${i} .value=${t} class="mono" @input=${ie(n)}></textarea></label>`}function j(e,t,n,i={}){let a=t===void 0||Number.isNaN(t)?"":String(t);return u`<label class="field"><span>${e}</span>
    <input type="number" .value=${a} step=${i.step??"any"} min=${i.min??m} max=${i.max??m}
      @input=${ie(r=>{if(r.trim()===""){i.optional&&n(void 0);return}let o=Number(r);Number.isNaN(o)||n(o)})} /></label>`}function W(e,t,n,i){return u`<label class="field"><span>${e}</span>
    <select @change=${ie(a=>i(a))}>
      ${n.map(([a,r])=>u`<option value=${a} ?selected=${a===t}>${r}</option>`)}
    </select></label>`}function yi(e,t,n,i){let a=i.format??(r=>String(Math.round(r*100)/100));return u`<div class="field slider"><span>${e}</span>
    <div class="slider-row">
      <input type="range" min=${i.min} max=${i.max} step=${i.step} .value=${String(t)}
        @input=${ie(r=>{let o=Number(r);Number.isNaN(o)||n(o)})} />
      <span class="slider-value mono">${a(t)}</span>
      <button class="icon" title=${`Back to ${a(i.def)}`} aria-label="Reset" ?disabled=${t===i.def}
        @click=${()=>n(i.def)}>${z("reset")}</button>
    </div></div>`}function ue(e,t,n){return u`<label class="field check"><input type="checkbox" .checked=${t} @change=${i=>n(i.target.checked)} /><span>${e}</span></label>`}function he(e,t,n,i=!1){let a=(t??"").replace(/^#/,""),r=/^[0-9a-fA-F]{6}([0-9a-fA-F]{2})?$/.test(a),o=r?`#${a.slice(0,6)}`:"#ffffff",l=r&&a.length===8?Math.round(parseInt(a.slice(6,8),16)/255*100):100,s=(d,c)=>{let p=d.replace(/^#/,"").toUpperCase();return c>=100?`#${p}`:`#${p}${Math.round(c/100*255).toString(16).padStart(2,"0").toUpperCase()}`};return u`<div class="field color"><span>${e}</span>
    <div class="color-row">
      ${i?u`<input type="checkbox" title="Enabled" .checked=${t!==void 0} @change=${d=>n(d.target.checked?s(o,l):void 0)} />`:m}
      <input type="color" .value=${o} ?disabled=${i&&t===void 0} @input=${ie(d=>n(s(d,l)))} />
      <input type="range" min="0" max="100" .value=${String(l)} title="Opacity" ?disabled=${i&&t===void 0} @input=${ie(d=>n(s(o,Number(d))))} />
      <input type="text" class="mono hex" .value=${t??""} placeholder="#RRGGBB" ?disabled=${i&&t===void 0}
        @input=${ie(d=>{let c=d.trim();/^#?[0-9a-fA-F]{6}([0-9a-fA-F]{2})?$/.test(c)&&n(c.startsWith("#")?c.toUpperCase():`#${c.toUpperCase()}`)})} />
    </div></div>`}function Vr(e,t){let n=e[t],i=n&&typeof n.attributes.friendly_name=="string"?n.attributes.friendly_name:t;return{entityId:t,displayName:i,domain:t.split(".")[0]??""}}function Ws(e,t){let n=t===void 0?void 0:typeof t=="string"?[t]:t,i=[];for(let[a,r]of Object.entries(e)){let o=a.split(".")[0]??"";if(n!==void 0&&!n.includes(o))continue;let l=typeof r?.attributes?.friendly_name=="string"?r.attributes.friendly_name.trim():"";i.push({entityId:a,name:l||a,state:r?.state??"",domain:o})}return i.sort((a,r)=>a.name.localeCompare(r.name)||a.entityId.localeCompare(r.entityId)),i}var Dr=50;function js(e){let t=e.state.trim().split(/\s+/)[0]??"";return t!==""&&Number.isFinite(Number(t))}function qs(e,t,n=Dr,i){let a=t.trim().toLowerCase(),r=s=>i===void 0||i(s)?0:1;if(a==="")return(i===void 0?e.slice():[...e].sort((s,d)=>r(s)-r(d))).slice(0,n);let o=a.split(/\s+/),l=[];for(let s of e){let d=s.entityId.toLowerCase(),c=s.name.toLowerCase(),p=-1;d===a?p=0:d.startsWith(a)?p=1:c.startsWith(a)?p=2:d.includes(a)?p=3:c.includes(a)?p=4:o.length>1&&o.every(h=>d.includes(h)||c.includes(h))&&(p=5),p>=0&&l.push({c:s,rank:p})}return l.sort((s,d)=>s.rank-d.rank||r(s.c)-r(d.c)||s.c.name.localeCompare(d.c.name)||s.c.entityId.localeCompare(d.c.entityId)),l.slice(0,n).map(s=>s.c)}var Ys=/^[a-z0-9_]+\.[a-z0-9_]+$/i;function Br(e){return Ys.test(e.trim())}function Js(e,t,n){let i=e.trim();if(i!==t.entityId){if(i==="")return{entityId:"",displayName:"",domain:""};if(i in n)return Vr(n,i);if(Br(i))return{...t,entityId:i,domain:i.split(".")[0]??""}}}var dt=new Map;function Ce(e){let t=e instanceof Node?e:null;for(let n=0;t&&n<8;n+=1){let i=t.getRootNode();if(!(i instanceof ShadowRoot))return;let a=i.host;if(typeof a.requestUpdate=="function"){a.requestUpdate();return}t=a}}function Gr(e){return dt.has(e)}function _e(e,t,n,i,a,r={}){let o=e.hass.states,l=dt.get(a),s=l?qs(Ws(o,r.domain),l.query,Dr,r.preferNumeric?js:void 0):[],d=l?Math.max(0,Math.min(l.index,s.length-1)):0,c=n.entityId?o[n.entityId]:void 0,p=($,f,v=0)=>{dt.set(a,{query:f,index:v}),Ce($)},h=$=>{dt.delete(a),Ce($)},y=$=>{let f=Js($,n,o);f&&i(f)},g=($,f)=>{i(Vr(o,$.entityId)),h(f)},x=()=>Math.max(0,Math.min(dt.get(a)?.index??0,s.length-1)),w=$=>{let f=$.target;if($.key==="ArrowDown"||$.key==="ArrowUp"){$.preventDefault();let v=dt.get(a);if(!v){p(f,f.value);return}let b=$.key==="ArrowDown"?x()+1:x()-1;p(f,v.query,Math.max(0,Math.min(s.length-1,b))),Xs(f);return}if($.key==="Enter"){$.preventDefault();let v=s[x()];l&&v?g(v,f):(y(f.value),h(f));return}if($.key==="Escape"){if(!l)return;$.preventDefault(),$.stopPropagation(),h(f)}},T=n.entityId===""?u`<div class="hint">Type part of a name, such as "kitchen".</div>`:c?u`<div class="entity-current"><span class="ent-name">${typeof c.attributes.friendly_name=="string"?c.attributes.friendly_name:n.entityId}</span><span class="ent-state">${c.state}</span></div>`:u`<div class="hint warn">Not in Home Assistant right now.</div>`;return u`<div class="field entity-field">
    <span>${t}</span>
    <input type="text" class="mono" role="combobox" aria-autocomplete="list" aria-expanded=${l?"true":"false"} autocomplete="off" spellcheck="false"
      .value=${l?l.query:n.entityId}
      placeholder="Search entities, or type an id"
      @focus=${$=>{let f=$.target;p(f,n.entityId),f.select()}}
      @input=${$=>{let f=$.target;p(f,f.value)}}
      @keydown=${w}
      @blur=${$=>{let f=$.target;l&&y(f.value),h(f)}} />
    ${l?u`<div class="entity-results" role="listbox">
          ${s.length===0?u`<div class="hint" style="padding:6px 8px">${Br(l.query)?"Nothing here has that id. Press Enter to use it anyway.":"Nothing matches that search."}</div>`:s.map(($,f)=>u`<button type="button" role="option" aria-selected=${f===d?"true":"false"} class="ent ${f===d?"hl":""}"
                @mousedown=${v=>v.preventDefault()} @click=${v=>g($,v.target)}>
                <span class="ent-main">
                  <span class="ent-name">${$.name}</span>
                  <span class="ent-id mono">${$.entityId}</span>
                </span>
                <span class="ent-state">${$.state}</span>
              </button>`)}
        </div>`:T}
    ${r.compact?m:u`<details class="sub">
      <summary>Display name: ${n.displayName||"(none)"}</summary>
      ${ee("Display name",n.displayName,$=>i({...n,displayName:$}))}
      <div class="hint">Stored with the entity and used where the watch needs a label for it.</div>
    </details>`}
  </div>`}function Xs(e){requestAnimationFrame(()=>{e.closest(".entity-field")?.querySelector("button.ent.hl")?.scrollIntoView({block:"nearest"})})}var Zs=120;function Qs(e,t,n,i){let a=r=>i.size===0?[...r]:r.filter(o=>i.has(o));return e!==""?{names:a(on.find(r=>r.name===e)?.symbols??[]),fromPack:!1}:t.trim()!==""&&n.length>0?{names:[...n],fromPack:!0}:{names:a(sn),fromPack:!1}}function Fr(e,t){return t.size===0?e.length:e.filter(n=>t.has(n)).length}function el(e){return[{value:"",label:`Starter set (${Fr(sn,e)})`},...on.map(t=>({value:t.name,label:`${t.name} (${Fr(t.symbols,e)})`}))]}function tl(e){return e.length>0?e.length:sn.length}function nl(e,t,n,i){return n?t>e?`Showing ${e} of ${t}. Type more to narrow it down.`:t===1?"1 symbol matches.":`${t} symbols match.`:i===1?"1 symbol available.":`${i} symbols available.`}function Rr(e,t,n,i){let a=e.icons.render(t,22,"#FFFFFF");return u`<button type="button" class="sym ${n?"on":""}" title=${t} @click=${()=>i(t)}>
    <span class="sym-glyph">${a??u`<span class="sym-none">?</span>`}</span>
    <span class="sym-name">${t}</span>
  </button>`}function Ur(e,t,n,i){let a=e.symbols,r=a.isOpen(i),o=a.query(i),l=e.icons.names(),s=l??[],d=new Set(s),c=t.trim(),p=c!==""&&d.size>0&&!d.has(c),h=g=>{n(g),a.noteUsed(g)},y=m;if(r){let g=a.category(i),x=Qs(g,o,s,d),w=sr(x.names,o),T=x.fromPack?w.slice(0,Zs):w,$=d.size===0?a.recent:a.recent.filter(f=>d.has(f));y=u`<div class="sym-browse">
      <div class="sym-controls">
        <input type="search" placeholder="Search symbols" .value=${o} @input=${ie(f=>a.setQuery(i,f))} />
        <select @change=${ie(f=>a.setCategory(i,f))}>
          ${el(d).map(f=>u`<option value=${f.value} ?selected=${f.value===g}>${f.label}</option>`)}
        </select>
      </div>
      ${$.length===0?m:u`<div class="hint">Recent</div>
        <div class="sym-grid one-row">${$.map(f=>Rr(e,f,f===c,h))}</div>`}
      <div class="sym-grid">${T.map(f=>Rr(e,f,f===c,h))}</div>
      ${w.length===0?u`<div class="hint">Nothing matches that search. Any name can still be typed above.</div>`:u`<div class="hint">
            ${nl(T.length,w.length,o.trim()!=="",tl(s))}
          </div>`}
      ${e.icons.available()?l!==void 0&&l.length===0?u`<div class="hint">The icon pack does not list its symbols, so search covers the built-in set only. Any other name can still be typed above.</div>`:m:u`<div class="hint warn">No icon pack is installed, so the list shows names without pictures. Install the Cupertino Icons frontend to see them.</div>`}
    </div>`}return u`
    <label class="field"><span>Symbol</span>
      <input type="text" class="mono" .value=${t} placeholder="lightbulb.fill"
        @input=${ie(n)} @change=${ie(g=>{(d.size===0||d.has(g.trim()))&&a.noteUsed(g)})} /></label>
    ${p?u`<div class="hint warn">The installed icon pack has no <code>${c}</code>, so the preview shows a placeholder. The watch still draws it if the name is a real SF Symbol.</div>`:m}
    <button type="button" class="link" @click=${()=>a.toggle(i)}>${r?"Hide symbols":"Browse symbols"}</button>
    ${y}`}var il=[["literal","Fixed text"],["entityState","Entity state"],["entityAttribute","Entity attribute"],["entityAge","Entity age (seconds)"],["aggregate","Aggregate"],["time","Time"],["dataAge","Data age (seconds)"],["jinja","Jinja template"],["named","Named value"]],al=[["now","Now (HH:mm)"],["hour","Hour"],["minute","Minute"],["weekday","Weekday"],["day","Day"],["month","Month"],["timestamp","Unix timestamp"]];function rl(e,t){let n="entityId"in e?{entityId:e.entityId,displayName:e.displayName,domain:e.domain}:{entityId:"",displayName:"",domain:""};switch(t){case"literal":return{kind:t,value:e.kind==="literal"?e.value:""};case"entityState":return{kind:t,...n};case"entityAttribute":return{kind:t,...n,attribute:""};case"entityAge":return{kind:t,...n};case"aggregate":return{kind:t,aggregate:{function:"count",scope:{kind:"filter",domains:[],areaIds:[],labelIds:[],floorIds:[]},stateFilter:{kind:"isOn"}}};case"time":return{kind:t,timeField:"now"};case"dataAge":return{kind:t};case"jinja":return{kind:t,value:e.kind==="jinja"?e.value:"{{ states('sensor.example') }}"};case"named":return{kind:t,id:""}}}function Z(e,t,n,i){if(i.inline||!ol())return u`<div class="value-editor">${jr(e,t,n,i)}</div>`;let a=$i(i.key),r=i.label??"Value",o=i.showResolved?e.resolve(t):void 0,l=de(t,ce(e));return u`<div class="field value-chip-field ${i.compact?"compact":""}">
    ${i.compact?m:u`<span>${r}</span>`}
    <button type="button" class="value-chip ${i.compact?"chip-cell":""}" popovertarget=${a} aria-haspopup="dialog" title=${`${r}: ${l}. Click to change it.`}>
      <span class="chip-text">${l}</span>
      ${o===void 0?m:u`<span class="chip-now mono" title="Value right now">${o}</span>`}
      <span class="chip-caret" aria-hidden="true">▾</span>
    </button>
    ${Kr(e,a,r,t,n,i)}
  </div>`}function Kr(e,t,n,i,a,r){return u`<div class="value-pop" id=${t} popover role="dialog" aria-label=${n} @toggle=${Wr}>
    <div class="pop-head">
      <b>${n}</b>
      <span class="spacer"></span>
      <button type="button" class="small" popovertarget=${t} popovertargetaction="hide">Done</button>
    </div>
    ${Mt.has(t)?jr(e,i,a,r):m}
  </div>`}function ce(e){return{values:e.config.values,hass:e.hass}}function $i(e){return`wa-pop-${e.replace(/[^a-zA-Z0-9_-]/g,"")}`}function ol(){return typeof HTMLElement<"u"&&typeof HTMLElement.prototype.showPopover=="function"}var Mt=new Set,At=new WeakMap;function sl(e){let t=e.getRootNode();return(t instanceof ShadowRoot||t instanceof Document?t:e.ownerDocument).querySelector(`[popovertarget="${e.id}"]`)}function ll(e,t){let n=e instanceof Node?e:null;if(!n)return;let i=n.getRootNode();!(i instanceof ShadowRoot)&&!(i instanceof Document)||requestAnimationFrame(()=>requestAnimationFrame(()=>{let a=i.querySelector(`#${CSS.escape(t)}`);a&&typeof a.showPopover=="function"&&!a.matches(":popover-open")&&a.showPopover()}))}function Wr(e){let t=e.currentTarget,n=e.newState==="open",i=At.get(t);if(i&&(i(),At.delete(t)),!n){Mt.delete(t.id)&&Ce(t);return}let a=sl(t);if(!a)return;let r=()=>{if(!t.isConnected||!t.matches(":popover-open")){At.get(t)?.(),At.delete(t);return}let o=a.getBoundingClientRect();if(o.bottom<0||o.top>window.innerHeight){t.hidePopover();return}vi(t,o)};window.addEventListener("scroll",r,!0),window.addEventListener("resize",r),At.set(t,()=>{window.removeEventListener("scroll",r,!0),window.removeEventListener("resize",r)}),vi(t,a.getBoundingClientRect()),Mt.has(t.id)||(Mt.add(t.id),Ce(t),requestAnimationFrame(()=>{t.isConnected&&vi(t,a.getBoundingClientRect())}))}function vi(e,t){e.style.maxHeight="";let n=e.getBoundingClientRect(),i=dl({left:t.left,top:t.top,bottom:t.bottom,width:t.width},{width:n.width,height:n.height},{width:window.innerWidth,height:window.innerHeight});e.style.left=`${i.left}px`,e.style.top=`${i.top}px`,e.style.maxHeight=`${i.maxHeight}px`}var Ye=8,pn=6,Ir=140;function dl(e,t,n){let i=n.height-e.bottom-pn-Ye,a=e.top-pn-Ye,r=t.height>i&&a>i&&i<Ir,o=Math.max(Ir,r?a:i),l=Math.min(t.height,o),s=Math.max(Ye,Math.min(e.left,n.width-t.width-Ye)),d=r?Math.max(Ye,e.top-pn-l):Math.max(Ye,Math.min(e.bottom+pn,n.height-l-Ye));return{left:s,top:d,maxHeight:o,above:r}}function jr(e,t,n,i){let a=t.kind,r=c=>n({...t,kind:c}),o=i.key,l=il.filter(([c])=>i.allowNamed!==!1||c!=="named"),s=m;switch(a.kind){case"literal":s=i.symbol?Ur(e,a.value,c=>r({...a,value:c}),o):ee("Text",a.value,c=>r({...a,value:c}));break;case"entityState":case"entityAge":s=_e(e,"Entity",a,c=>r({...a,...c}),`${o}-entity`);break;case"entityAttribute":{let c=Object.keys(e.hass.states[a.entityId]?.attributes??{}).sort(),p=`wa-attrs-${o.replace(/[^a-z0-9]/gi,"")}`;s=u`${_e(e,"Entity",a,h=>r({...a,...h}),`${o}-entity`)}
        ${ee("Attribute",a.attribute,h=>r({...a,attribute:h}),{list:p,mono:!0})}
        <datalist id=${p}>${c.map(h=>u`<option value=${h}></option>`)}</datalist>`;break}case"aggregate":s=pl(e,a.aggregate,c=>r({...a,aggregate:c}),o);break;case"time":s=W("Field",a.timeField,al,c=>r({...a,timeField:c}));break;case"dataAge":s=u`<div class="hint">Seconds since the watch last fetched values.</div>`;break;case"jinja":s=u`${Ks("Template",a.value,c=>r({...a,value:c}),4)}
        <div class="hint">Rendered by Home Assistant. The result should be one value, not a whole document.</div>`;break;case"named":s=e.config.values.length===0?u`<div class="hint warn">There are no named values yet. Add one in the Data card first.</div>`:W("Value",a.id,[["","(choose)"],...e.config.values.map(c=>[c.id,c.name||c.id.slice(0,8)])],c=>r({...a,id:c}));break}let d=i.showResolved?e.resolve(t):void 0;return u`
    ${W("Source",a.kind,l,c=>r(rl(a,c)))}
    ${s}
    ${i.noFormat?m:cl(t.format,c=>n($e(c)?{kind:t.kind}:{...t,format:c}))}
    ${i.showResolved?u`<div class="hint">Now: ${d===void 0?u`<span class="warn">unresolved</span>`:u`<code>${d}</code>`}</div>`:m}`}function cl(e,t){let n=e??{},i=a=>{let r={...n,...a};for(let o of Object.keys(r))(r[o]===void 0||r[o]===!1||r[o]==="")&&delete r[o];t(r)};return u`<details class="sub" ?open=${!$e(e)}>
    <summary>Format${$e(e)?"":" (on)"}</summary>
    <div class="grid2">
      ${j("Decimals",n.decimals,a=>i({decimals:a}),{step:1,min:0,max:6,optional:!0})}
      ${j("Multiply",n.multiply,a=>i({multiply:a}),{optional:!0})}
      ${j("Offset",n.offset,a=>i({offset:a}),{optional:!0})}
      ${W("Case",n.textCase??"",[["","As is"],["upper","UPPER"],["lower","lower"],["capitalized","Capitalized"]],a=>i({textCase:a||void 0}))}
      ${ee("Prefix",n.prefix??"",a=>i({prefix:a}))}
      ${ee("Suffix",n.suffix??"",a=>i({suffix:a}))}
    </div>
    ${ue("Append the entity's unit",!!n.useEntityUnit,a=>i({useEntityUnit:a}))}
    ${ue("Show as relative time (45s, 2m, 3h)",!!n.relativeTime,a=>i({relativeTime:a}))}
  </details>`}function pl(e,t,n,i){let a=l=>l.join(", "),r=l=>l.split(",").map(s=>s.trim()).filter(Boolean),o=t.scope;return u`
    ${W("Function",t.function,[["count","Count"],["sum","Sum"],["average","Average"],["min","Min"],["max","Max"]],l=>n({...t,function:l}))}
    ${W("Over",o.kind,[["filter","Entities matching a filter"],["entities","A fixed entity list"]],l=>n({...t,scope:l==="entities"?{kind:"entities",entities:[]}:{kind:"filter",domains:[],areaIds:[],labelIds:[],floorIds:[]}}))}
    ${o.kind==="filter"?u`<div class="grid2">
          ${ee("Domains",a(o.domains),l=>n({...t,scope:{...o,domains:r(l)}}),{placeholder:"light, switch"})}
          ${ee("Area ids",a(o.areaIds),l=>n({...t,scope:{...o,areaIds:r(l)}}))}
          ${ee("Label ids",a(o.labelIds),l=>n({...t,scope:{...o,labelIds:r(l)}}))}
          ${ee("Floor ids",a(o.floorIds),l=>n({...t,scope:{...o,floorIds:r(l)}}))}
        </div>`:u`${o.entities.map((l,s)=>u`<div class="row-inline">
            ${_e(e,`Entity ${s+1}`,l,d=>{let c=[...o.entities];c[s]=d,n({...t,scope:{...o,entities:c}})},`${i}-agg-${s}`,{compact:!0})}
            <button class="icon" title="Remove" @click=${()=>n({...t,scope:{...o,entities:o.entities.filter((d,c)=>c!==s)}})}>${z("close")}</button>
          </div>`)}
          <button class="small" @click=${()=>n({...t,scope:{...o,entities:[...o.entities,{entityId:"",displayName:"",domain:""}]}})}>Add entity</button>`}
    ${W("Only count when",t.stateFilter?.kind??"",[["","Any state"],["isOn","On"],["isOff","Off"],["equals","State equals"],["notEquals","State does not equal"]],l=>{let s={...t};l===""?delete s.stateFilter:l==="equals"||l==="notEquals"?s.stateFilter={kind:l,value:t.stateFilter&&"value"in t.stateFilter?t.stateFilter.value:""}:s.stateFilter={kind:l},n(s)})}
    ${t.stateFilter&&"value"in t.stateFilter?ee("State",t.stateFilter.value,l=>n({...t,stateFilter:{kind:t.stateFilter.kind,value:l}})):m}
    ${t.function==="count"?m:ee("Attribute (blank = state)",t.attribute??"",l=>{let s={...t};l?s.attribute=l:delete s.attribute,n(s)})}`}var qr=On,ul=qr.filter(([e])=>e!=="none");function hl(e,t){return e!==void 0&&t.trim()!==""&&t.trim()!==e.trim()}function Yr(e){let t=e.config,n=t.tapAction,i=s=>["toggleEntity","runScene","runScript","addTodo","runHTTPAction"].includes(s),a=hl(e.savedName,t.name),r=t.refreshMinutes??0,o=Ar.map(s=>[String(s),Mr(s)]);Ar.includes(r)||o.push([String(r),Mr(r)]);let l=t.showSuccessFlash??!0;return u`
    <div class="gen-row">
      ${ee("Name",t.name,s=>e.update(d=>{d.name=s},"name"))}
      ${W("Refresh",String(r),o,s=>e.update(d=>{d.refreshMinutes=Number(s)||0},"refresh"))}
      ${W("Tap action",n.type,qr,s=>e.update(d=>{d.tapAction=i(s)?{type:s,..."entityId"in d.tapAction?{entityId:d.tapAction.entityId,displayName:d.tapAction.displayName,domain:d.tapAction.domain}:{entityId:"",displayName:"",domain:""}}:{type:s},s!=="openPage"&&(delete d.openPageId,delete d.openPageName)}))}
      <div class="field flash-cell"><span>Flash when a tap works</span>
        <div class="flash-row">
          <input type="checkbox" .checked=${l} title="Flash when a tap works"
            @change=${s=>e.update(d=>{d.showSuccessFlash=s.target.checked})} />
          ${l?u`<input type="color" class="flash-color" title="Flash colour. Click to change it." .value=${(t.successFlashColorHex??ml).slice(0,7)}
                @input=${ie(s=>e.update(d=>{d.successFlashColorHex=s.toUpperCase()},"flash"))} />`:u`<span class="muted">Off</span>`}
        </div>
      </div>
    </div>
    ${a?u`<div class="hint warn">After you change a complication name, let the change sync to the watch, then re-select the complication in the watch's complication picker. Otherwise the list starts to look wrong.</div>`:m}
    ${"entityId"in n?_e(e,"Target",n,s=>e.update(d=>{d.tapAction={type:n.type,...s}},"tap-entity"),"general-tap"):m}
    ${n.type==="openPage"?fl(e):m}`}var ml="#808080",Ar=[0,15,30,60,120];function Mr(e){return e===0?"None":e%60===0?e===60?"Every hour":`Every ${e/60} hours`:e===1?"Every minute":`Every ${e} minutes`}function fl(e){let t=e.config;return Jr(e,t.openPageId,t.openPageName,(n,i)=>e.update(a=>{if(n===void 0){delete a.openPageId,delete a.openPageName;return}a.openPageId=n,i?a.openPageName=i:delete a.openPageName}))}function Jr(e,t,n,i){let a=t??"",r=e.pages.map(o=>[o.id,o.name||"Unnamed page"]);return a&&!e.pages.some(o=>o.id.toUpperCase()===a.toUpperCase())&&r.unshift([a,`${n||"Unknown page"} (not on the watch)`]),a||r.unshift(["","Choose a page\u2026"]),r.length<=1&&!a?u`<div class="hint">No pages reported yet. Open the watch app once so it can send its page list.</div>`:u`${W("Page",a,r,o=>{if(!o){i(void 0,void 0);return}i(o,e.pages.find(l=>l.id===o)?.name)})}
  ${a?m:u`<div class="hint">Without a page the tap falls back to the complication list.</div>`}`}function Xr(e,t){let n=e.config.values.findIndex(a=>a.id===t.id),i=`nv-${t.id}`;return u`
    ${ee("Name",t.name,a=>e.update(r=>{r.values[n].name=a},`${i}-name`))}
    ${Z(e,t.value,a=>e.update(r=>{r.values[n].value=a},i),{allowNamed:!1,showResolved:!0,inline:!0,key:i})}
    <div class="hint">Used by ${Lr(e.config,t.id)} layer${Lr(e.config,t.id)===1?"":"s"}.</div>`}function Lr(e,t){return JSON.stringify(e.elements).split(`"${t}"`).length-1+JSON.stringify(e.perFamily).split(`"${t}"`).length-1}function Zr(){return{id:q(),name:"Value",value:E("")}}function me(e,t,n){let i=e.perFamily[t],a=i?.placements[n.payload.id];return i&&Object.keys(i.placements).length>0&&a?{frame:a.frame,isHidden:a.isHidden,size:a.size,fromPlacement:!0}:{frame:n.payload.frame,isHidden:n.payload.isHidden,fromPlacement:!1}}function pe(e,t,n,i,a=!1){let r=e.elements.find(c=>c.payload.id===n);if(!r)return;let o=e.perFamily[t];o||(o={placements:{},cornerBodyShape:"circle",borderWidth:2,rules:[]},e.perFamily[t]=o);let l=me(e,t,r),d={...o.placements[n]??{frame:{...l.frame},isHidden:l.isHidden,...l.size!==void 0?{size:l.size}:{}},...i};if(a&&delete d.size,Object.keys(o.placements).length===0)for(let c of e.elements)c.payload.id!==n&&(o.placements[c.payload.id]={frame:{...c.payload.frame},isHidden:c.payload.isHidden});o.placements[n]=d}function gl(e){switch(e.kind){case"text":return e.payload.fontSize;case"icon":return e.payload.size;case"gauge":return e.payload.lineWidth;case"shape":return;case"image":return;case"tap":return}}function zr(e){return e.length===0?"none":e.every(t=>t)?"all":e.every(t=>!t)?"none":"mixed"}function yl(e){return e.kind==="image"||e.kind==="tap"?void 0:e.payload.colorSlot.baseColorHex}function Qr(e,t,n){let i=zr(n.map(d=>me(e,t,d).isHidden)),a=zr(n.map(d=>d.payload.isHidden)),r=n.map(yl),o=n.length>0&&r.every(d=>d!==void 0),l=r[0],s=o&&l!==void 0&&r.every(d=>d!==void 0&&d.toUpperCase()===l.toUpperCase());return{hiddenHere:i,hiddenEverywhere:a,colourable:o,colour:s?l:void 0}}var ki=[["regular","Regular"],["medium","Medium"],["semibold","Semibold"],["bold","Bold"]];function vl(e,t,n){let i=t.payload.id,a=qt(e.config,i),r=a[0]?.ref??{entityId:"",displayName:"",domain:""},o=t.kind==="image"?{domain:"camera"}:{};return u`
    ${_e(e,t.kind==="image"?"Camera":"Entity",r,l=>e.update(s=>Fa(s,i,l),`${n}-entity`),`${n}-layer-entity`,o)}
    <div class="hint">${xl(t,a)}</div>`}function bl(e){if(e.kind==="text"||e.kind==="gauge")return e.payload.value;if(e.kind==="icon")return e.payload.symbol}function wl(e){return e.length<=1?e.join(""):`${e.slice(0,-1).join(", ")} and ${e[e.length-1]}`}function xl(e,t){let n=bl(e),i=n?.kind.kind,r=n!==void 0&&!("entityId"in n.kind)&&!(i==="literal"&&(e.kind==="text"||e.kind==="gauge"))?i==="named"?" Its content comes through a named value, so change that value in the Data card to point it somewhere else.":e.kind==="icon"&&i==="literal"?" The symbol above is a fixed name and stays as it is.":" The value above was written by hand and stays as it is.":"";if(t.length===0)return e.kind==="shape"?"A shape draws no value, so an entity reaches it only through a tap. Tick Tappable below, then choose the entity here.":`Nothing on this layer reads an entity yet. Choosing one points the layer, and its tap, at it.${r}`;let o=[],l=t.find(d=>d.where==="value"||d.where==="symbol"||d.where==="camera");l&&o.push(l.where==="symbol"?"the symbol":l.where==="camera"?"the picture":e.kind==="gauge"?"the reading":"the text"),t.some(d=>d.where==="tap")&&o.push("the tap");let s=t.filter(d=>d.where==="test").length;return s>0&&o.push(s===1?"1 state test":`${s} state tests`),`Used by ${wl(o)}.${r}`}function $l(e){return e.zoom<1?"Below 1x the picture pulls away from the frame and the spare edges are left empty. Pan still moves whatever does overflow.":e.contentMode==="fit"&&e.zoom===1?"The whole picture is inside the frame, so there is nothing to pan. Zoom in, or switch to Fill, to crop it first.":"Pan moves the frame over the picture: -1 is hard left (or top), 1 is hard right (or bottom). An edge the picture does not overflow cannot move."}function kl(e,t){let n=e.timestamp===!0,i=Ee(e),a=r=>t(o=>{r?(o.timestampX=o.timestampCorner.endsWith("Leading")?.16:.84,o.timestampY=o.timestampCorner.startsWith("top")?.16:.84):(Ee(o)&&(o.timestampCorner=Pn(o.timestampX,o.timestampY)),delete o.timestampX,delete o.timestampY)});return u`
    ${ue("Show timestamp",n,r=>t(o=>{r?o.timestamp=!0:delete o.timestamp}))}
    ${n?u`
      ${W("Placement",i?"free":"corner",[["corner","A corner"],["free","Anywhere"]],r=>a(r==="free"))}
      ${i?m:W("Corner",e.timestampCorner,[["topLeading","Top left"],["topTrailing","Top right"],["bottomLeading","Bottom left"],["bottomTrailing","Bottom right"]],r=>t(o=>{o.timestampCorner=r}))}
      ${j("Text size (pt)",e.timestampSize,r=>t(o=>{o.timestampSize=Math.min(40,Math.max(4,r??$t))},"tssize"),{step:1,min:4,max:40})}
      <div class="hint">Click the chip in the preview to select it. Drag it to move it (it stays inside the picture), or drag a corner to change the text size.</div>
      <div class="hint">The time the snapshot was fetched, not the time now. A frame that stops updating keeps its old time.</div>`:m}`}function re(e,t,n,i,a={}){let r=e.openSections.has(t),o=()=>e.toggleSection(t);return u`<section class="sec" data-open=${r?"true":"false"} style=${a.color?`--c:${a.color}`:""}>
    <div class="sec-h" role="button" tabindex="0" aria-expanded=${r?"true":"false"} @click=${o}
      @keydown=${l=>{(l.key==="Enter"||l.key===" ")&&(l.preventDefault(),o())}}>
      <span class="swatch">${z(a.icon??"content")}</span>
      <span class="tt"><h4>${n}</h4>${a.summary?u`<span class="sum">${a.summary}</span>`:m}</span>
      <span class="chev">${z("chevron")}</span>
    </div>
    ${r?u`<div class="sec-b">${i}</div>`:m}
  </section>`}function Cl(e,t){let n=ce(e);switch(t.kind){case"text":return ct(de(t.payload.value,n),48);case"icon":return ct(de(t.payload.symbol,n),48);case"gauge":return ct(de(t.payload.value,n),48);case"shape":return t.payload.kind==="roundedRectangle"?"Rounded rectangle":t.payload.kind;case"image":return t.payload.entity.displayName||t.payload.entity.entityId||"No camera yet";case"tap":return Te(t.payload.action)}}function _r(e){switch(e.kind){case"text":return`${e.payload.fontSize} pt ${e.payload.fontWeight.toLowerCase()} \xB7 ${be(e.payload.colorSlot.baseColorHex)}`;case"icon":return`${e.payload.size} pt \xB7 ${be(e.payload.colorSlot.baseColorHex)}`;case"gauge":return`${e.payload.style} \xB7 ${e.payload.lineWidth} pt line \xB7 ${be(e.payload.colorSlot.baseColorHex)}`;case"shape":return`${be(e.payload.colorSlot.baseColorHex)}${e.payload.borderColorHex?` \xB7 ${e.payload.borderWidth} pt border`:""}`;case"image":return`${e.payload.contentMode==="fill"?"Fill the frame":"Fit inside"} \xB7 ${e.payload.zoom.toFixed(2)}x \xB7 corners ${e.payload.cornerRadius} pt`;case"tap":return}}function eo(e,t,n){let i=t.payload.id,a=e.config.elements.findIndex(f=>f.payload.id===i),r=`el-${i}`,o=(f,v)=>e.update(b=>f(b.elements[a]),v?`${r}-${v}`:void 0),l=me(e.config,n,t),s=l.frame,d=(f,v)=>e.update(b=>pe(b,n,i,{frame:{...s,...f}}),`${r}-${v}-${n}`),c=t.kind==="text"?"Font size":t.kind==="icon"?"Icon size":"Line width",p,h;switch(t.kind){case"text":p=u`
        ${Z(e,t.payload.value,f=>o(v=>{v.payload.value=f},"value"),{showResolved:!0,label:"Text",key:`${r}-value`})}
        ${ue("Live countdown",t.payload.countdown===!0,f=>o(v=>{let b=v.payload;f?b.countdown=!0:delete b.countdown}))}
        ${t.payload.countdown?u`<div class="hint">Ticks down to the value's target: an active timer's finish, or any future timestamp. A paused timer shows its remaining time.</div>`:m}`,h=u`<div class="grid2">
          ${j("Font size (pt)",t.payload.fontSize,f=>o(v=>{v.payload.fontSize=f??14},"size"),{step:1,min:4})}
          ${W("Weight",t.payload.fontWeight,ki,f=>o(v=>{v.payload.fontWeight=f}))}
        </div>`;break;case"icon":p=u`
        ${Z(e,t.payload.symbol,f=>o(v=>{v.payload.symbol=f},"symbol"),{noFormat:!0,showResolved:!0,symbol:!0,label:"Symbol",key:`${r}-symbol`})}
        <div class="hint">An entity source draws that entity's own icon instead.</div>`,h=j("Icon size (pt)",t.payload.size,f=>o(v=>{v.payload.size=f??14},"size"),{step:1,min:4});break;case"gauge":p=u`
        ${Z(e,t.payload.value,f=>o(v=>{v.payload.value=f},"value"),{showResolved:!0,label:"Reading",key:`${r}-value`})}
        <div class="grid2">
          ${j("Min",t.payload.minValue,f=>o(v=>{v.payload.minValue=f??0},"min"))}
          ${j("Max",t.payload.maxValue,f=>o(v=>{v.payload.maxValue=f??100},"max"))}
        </div>`,h=u`
        <div class="grid2">
          ${W("Style",t.payload.style,[["arc","Arc (270\xB0)"],["ring","Ring"],["bar","Bar"]],f=>o(v=>{v.payload.style=f}))}
          ${j("Line width (pt)",t.payload.lineWidth,f=>o(v=>{v.payload.lineWidth=f??4},"lw"),{step:.5,min:.5})}
        </div>
        ${he("Track colour",t.payload.trackColorHex,f=>o(v=>{v.payload.trackColorHex=f??"#FFFFFF40"},"track"))}`;break;case"shape":p=u`<div class="grid2">
          ${W("Shape",t.payload.kind,[["roundedRectangle","Rounded rectangle"],["rectangle","Rectangle"],["capsule","Capsule"],["circle","Circle"]],f=>o(v=>{v.payload.kind=f}))}
          ${t.payload.kind==="roundedRectangle"?j("Corner radius (pt)",t.payload.cornerRadius,f=>o(v=>{v.payload.cornerRadius=f??6},"radius"),{step:.5,min:0}):m}
        </div>`,h=u`
        ${he("Border colour",t.payload.borderColorHex,f=>o(v=>{f===void 0?delete v.payload.borderColorHex:v.payload.borderColorHex=f},"border"),!0)}
        ${t.payload.borderColorHex!==void 0?j("Border width (pt)",t.payload.borderWidth,f=>o(v=>{v.payload.borderWidth=f??1},"bw"),{step:.5,min:0}):m}`;break;case"image":{let f=t.payload,v=(b,F)=>o(M=>b(M.payload),F);p=u`
        ${f.entity.entityId&&!f.entity.entityId.startsWith("camera.")?u`<div class="hint warn">Only camera entities have snapshots, so this layer stays blank until the entity is a camera.</div>`:m}
        <div class="hint">The watch fetches a snapshot on refresh and shows the cached frame in between. This preview shows the camera live.</div>`,h=u`
        ${W("Picture",f.contentMode,[["fill","Fill the frame (crop)"],["fit","Fit the whole picture"]],b=>v(F=>{F.contentMode=b}))}
        ${yi("Zoom",f.zoom,b=>v(F=>{F.zoom=b},"zoom"),{min:oi,max:4,step:.05,def:1,format:b=>`${b.toFixed(2)}x`})}
        ${yi("Pan left/right",f.panX,b=>v(F=>{F.panX=b},"panx"),{min:-1,max:1,step:.02,def:0})}
        ${yi("Pan up/down",f.panY,b=>v(F=>{F.panY=b},"pany"),{min:-1,max:1,step:.02,def:0})}
        <div class="hint">${$l(f)}</div>
        ${j("Corner radius (pt)",f.cornerRadius,b=>v(F=>{F.cornerRadius=Math.max(0,b??xt)},"imgradius"),{step:1,min:0})}`;break}case"tap":{p=u`
        ${to(e,t.payload,(f,v)=>o(b=>f(b.payload),v),r)}
        <div class="hint">An invisible area: a tap inside this frame runs this action, and the layer highest in the list wins where two overlap.</div>
        <div class="hint">To make one layer tappable, tick Tappable on that layer instead.</div>`;break}}let y=t.kind==="image"||t.kind==="tap"?void 0:he(t.kind==="shape"?"Fill colour":"Colour",t.payload.colorSlot.baseColorHex,f=>o(v=>{v.kind!=="image"&&v.kind!=="tap"&&(v.payload.colorSlot.baseColorHex=f??"#FFFFFF")},"color")),g=Gn(e.config,t),x=g?{kind:{kind:"entityState",...g}}:void 0,w=Q[t.kind],T=t.kind==="tap"?void 0:ye(e.config,i)[0],$=t.kind==="image"?t.payload.timestamp===!0:!1;return u`
    ${re(e,"content","Content",u`${t.kind==="tap"?m:vl(e,t,r)}${p}`,{color:w,icon:"content",summary:Cl(e,t)})}
    ${h===void 0&&y===void 0?m:re(e,"look",t.kind==="image"?"Picture":"Look",u`${h??m}${y??m}`,{color:w,icon:t.kind==="image"?"image":"look",..._r(t)?{summary:_r(t)}:{}})}
    ${t.kind==="image"?re(e,"timestamp","Timestamp",kl(t.payload,(f,v)=>o(b=>f(b.payload),v)),{color:w,icon:"clock",summary:$?`Shown \xB7 ${t.payload.timestampSize} pt`:"Hidden"}):m}
    ${t.kind==="tap"?m:re(e,"tappable","Tap",Tl(e,t,r),{color:U.tap,icon:"tap",summary:T?Te(T.payload.action):"Not tappable"})}
    ${re(e,"states","States",so(e,t.payload.rules,t.kind,f=>f.elements.find(v=>v.payload.id===i)?.payload.rules,`rules-${i}`,x),{color:U.states,icon:"states",summary:It(t.payload.rules).replace(/\.$/,"")})}
    ${re(e,"placement","Place",u`
      <div class="grid4">
        ${j("X",s.x,f=>d({x:f??0},"x"),{step:.01})}
        ${j("Y",s.y,f=>d({y:f??0},"y"),{step:.01})}
        ${j("W",s.width,f=>d({width:f??.5},"w"),{step:.01,min:0})}
        ${j("H",s.height,f=>d({height:f??.5},"h"),{step:.01,min:0})}
      </div>
      ${j("Rotation (degrees)",s.rotationDegrees,f=>d({rotationDegrees:f??0},"rot"),{step:1})}
      ${t.kind==="shape"||t.kind==="image"||t.kind==="tap"?m:j(`${c} in ${O(n)} (blank = shared ${gl(t)})`,l.size,f=>e.update(v=>f===void 0?pe(v,n,i,{},!0):pe(v,n,i,{size:f}),`${r}-psize-${n}`),{step:1,min:1,optional:!0})}
      ${ue(`Hidden in ${O(n)}`,l.isHidden,f=>e.update(v=>pe(v,n,i,{isHidden:f})))}
      ${ue("Hidden in every shape",t.payload.isHidden,f=>o(v=>{v.payload.isHidden=f}))}
      <div class="hint">Drag the layer on the ${O(n)} preview to move it, or pull a corner to resize it. Frames are fractions of the canvas.</div>`,{color:U.place,icon:"place",summary:`${Math.round(s.width*100)}% wide \xB7 ${O(n)}${l.fromPlacement?"":" \xB7 shared frame"}`})}`}function to(e,t,n,i){let a=t.action,r=o=>["toggleEntity","runScene","runScript","addTodo","runHTTPAction"].includes(o);return u`
    ${W("Tap action",a.type,ul,o=>n(l=>{l.action=r(o)?{type:o,..."entityId"in l.action?{entityId:l.action.entityId,displayName:l.action.displayName,domain:l.action.domain}:{entityId:"",displayName:"",domain:""}}:{type:o},o!=="openPage"&&(delete l.openPageId,delete l.openPageName)}))}
    ${"entityId"in a?_e(e,"Target",a,o=>n(l=>{l.action={type:a.type,...o}},"tap-entity"),`${i}-tap`):m}
    ${a.type==="openPage"?Jr(e,t.openPageId,t.openPageName,(o,l)=>n(s=>{if(o===void 0){delete s.openPageId,delete s.openPageName;return}s.openPageId=o,l?s.openPageName=l:delete s.openPageName},"tap-page")):m}`}var Sl=24;function El(e,t){let n=[],i=1/0;for(let r of X){if(r==="inline"||!e.config.supportedFamilies.includes(r))continue;let o=Sa(e.config,t,r);o&&(n.push(`${O(r)} ${Math.round(o.width)} x ${Math.round(o.height)} pt`),i=Math.min(i,o.width,o.height))}if(n.length===0)return m;let a=i<Sl;return u`<div class=${a?"hint warn":"hint"}>${n.join(" \xB7 ")}${a?u`<br />That is small for a wrist. Show the tap area and drag its corners out.`:m}</div>`}function Tl(e,t,n){if(t.kind==="tap")return m;let i=t.payload.id,a=ye(e.config,i)[0],r=(l,s)=>e.update(d=>{let c=d.elements.find(p=>p.kind==="tap"&&p.payload.attachedTo===i);c&&l(c.payload)},s?`${n}-${s}`:void 0),o=Un(e.config,t);return u`
    ${ue("Tappable",a!==void 0,l=>e.update(s=>{l?jt(s,i):Wn(s,i)}))}
    ${a?u`<div class="value-editor">
          ${to(e,a.payload,r,`${n}-attached`)}
          <div class="chips">
            <button class="pick ${e.tapAreaShown?"on":""}" aria-pressed=${e.tapAreaShown?"true":"false"}
              title=${e.tapAreaShown?"Back to the normal face":"Dim the face and show only this layer's tap area, with corners to drag"}
              @click=${()=>e.showTapArea(!e.tapAreaShown)}><span class="glyph">☞</span>${e.tapAreaShown?"Hide tap area":"Show tap area"}</button>
            ${Gt(a.payload.outset)?m:u`<button class="icon" title="Fit the tap area to the layer again" aria-label="Fit the tap area to the layer again"
                  @click=${()=>r(l=>{l.outset={...Nn}})}>${z("reset")}</button>`}
          </div>
        </div>
        ${El(e,a.payload.id)}
        <div class="hint">The tap area follows this layer in every shape, so there is nothing to line up. Show it to drag its corners past the layer, so a small layer is still an easy target. Where two tap areas overlap, the one higher in Layers wins.</div>`:u`<div class="hint">Tapping this layer runs an action of its own, instead of the complication's tap action. It starts as <b>${Te(o)}</b>.</div>`}`}function Hr(e){return e.length>=2&&e.startsWith('"')&&e.endsWith('"')?e.slice(1,-1):e}function He(e,t){switch(e.kind){case"text":return Hr(de(e.payload.value,t));case"icon":return Hr(de(e.payload.symbol,t));case"gauge":return de(e.payload.value,t);case"shape":return e.payload.kind==="roundedRectangle"?"Rounded rectangle":e.payload.kind;case"image":{let n=e.payload.entity;return n.displayName||n.entityId||"camera"}case"tap":{let n=e.payload.action,i="entityId"in n?n.displayName||n.entityId:n.type==="openPage"&&e.payload.openPageName||"";return i?`${n.type} \xB7 ${i}`:n.type}}}function no(e,t){let n=Le(e.config,t.id),i=ce(e),a=(r,o)=>e.update(l=>{let s=l.groups?.find(d=>d.id===t.id);s&&r(s)},o?`group-${t.id}-${o}`:void 0);return re(e,"content","Group",u`
    ${ee("Name",t.name,r=>a(o=>{o.name=r},"name"))}
    ${ue("Move as one on the watch",t.locked,r=>a(o=>{o.locked=r}))}
    <div class="hint">${t.locked?"Locked: a drag on any of these layers moves all of them. Unlock to move one at a time.":"Unlocked: each layer moves on its own. Lock it again when the part is the way you want it."}</div>
    <div class="hint">${n.length} layer${n.length===1?"":"s"}: ${n.map(r=>He(r,i)).join(", ")}. Click one in the list to edit it.</div>
    <div class="adders">
      <button class="small" title="Keep the layers where they are and drop the folder" @click=${()=>e.update(r=>Kt(r,t.id))}>Ungroup</button>
    </div>`,{color:U.group,icon:"folder",summary:`${n.length} layers \xB7 ${t.locked?"moves as one":"unlocked"}`})}function io(e,t){if(t==="inline")return u`${Fl(e)}${bi(e,t)}`;let n=e.config.perFamily[t];if(!n)return u`<div class="hint">No settings stored for ${O(t)} yet.</div>
      <button class="small" @click=${()=>e.update(l=>{l.perFamily[t]={placements:{},cornerBodyShape:"circle",borderWidth:2,rules:[]}})}>Add ${O(t)} settings</button>
      ${bi(e,t)}`;let i=(l,s)=>e.update(d=>l(d.perFamily[t]),s?`fam-${t}-${s}`:void 0),a=Object.keys(n.placements).length,r=n.backgroundColorHex?be(n.backgroundColorHex):"transparent",o=n.borderColorHex?`${n.borderWidth} pt ${be(n.borderColorHex)} border`:"no border";return u`
    ${re(e,"look",`${O(t)} shape`,u`
      ${he("Background (blank = transparent)",n.backgroundColorHex,l=>i(s=>{l===void 0?delete s.backgroundColorHex:s.backgroundColorHex=l},"bg"),!0)}
      ${he("Border colour",n.borderColorHex,l=>i(s=>{l===void 0?delete s.borderColorHex:s.borderColorHex=l},"border"),!0)}
      ${j("Border width (pt)",n.borderWidth,l=>i(s=>{s.borderWidth=l??2},"bw"),{step:.5,min:0})}`,{color:U.place,icon:"shape",summary:`${r} \xB7 ${o}`})}
    ${t==="corner"?re(e,"corner","Corner content",Rl(e,n,i),{color:U.place,icon:"content",summary:n.curvedText?"Big curved text":"Layer canvas"}):m}
    ${re(e,"states","Shape states",so(e,n.rules,"layout",l=>l.perFamily[t]?.rules,`rules-${t}`),{color:U.states,icon:"states",summary:It(n.rules).replace(/\.$/,"")})}
    ${re(e,"placements","Placements",u`
      <div class="hint">${a===0?"Layers use their shared frames here.":`${a} layer${a===1?" has":"s have"} a ${O(t)} placement.`}</div>
      ${a>0?u`<button class="small" @click=${()=>i(l=>{l.placements={}})}>Reset placements to the shared frames</button>`:m}`,{color:U.place,icon:"place",summary:a===0?"Shared frames":`${a} own placement${a===1?"":"s"}`})}
    ${bi(e,t)}`}function bi(e,t){let n=!rt(e.config,t),i=n?"A complication keeps at least one shape.":`Drop the ${O(t)} shape. The watch stops listing this complication for ${O(t)} slots.`;return re(e,"shape","Remove this shape",u`
    <div class="adders">
      <button class="danger small" ?disabled=${n} title=${i} @click=${()=>e.removeFamily(t)}>Remove the ${O(t)} shape</button>
    </div>
    ${n?u`<div class="hint">This is the only shape. Add another before removing it.</div>`:u`<div class="hint">The watch stops listing this complication for ${O(t)} slots.</div>`}`,{color:U.place,icon:"delete",summary:n?"The only shape":"Drops its layout"})}function Fl(e){let t=e.config.inline;if(!t)return u`<div class="hint">This complication lists Inline but has no Inline text yet (it was saved by an older integration). The watch shows "No inline layout" until one is added.</div>
      <button class="small" @click=${()=>e.addFamily("inline")}>Add Inline text</button>`;let n=(a,r)=>e.update(o=>{o.inline&&a(o.inline)},r?`inline-${r}`:void 0),i=ce(e);return u`
    ${re(e,"content","Inline text",u`
      ${ee("Label (blank = value only)",t.label??"",a=>n(r=>{a?r.label=a:delete r.label},"label"))}
      ${Z(e,t.value,a=>n(r=>{r.value=a},"value"),{showResolved:!0,label:"Text",key:"inline-value"})}
      ${ue("Live countdown",t.countdown===!0,a=>n(r=>{a?r.countdown=!0:delete r.countdown}))}
      ${t.countdown?u`<div class="hint">Ticks down to the value's target: an active timer's finish, or any future timestamp. A paused timer shows its remaining time.</div>`:m}`,{color:Q.text,icon:"text",summary:ct(`${t.label?`${t.label}: `:""}${de(t.value,i)}`,48)})}
    ${re(e,"symbol","Symbol",u`
      ${Ur(e,t.symbol??"",a=>n(r=>{a?r.symbol=a:delete r.symbol},"symbol"),"inline-symbol")}
      <div class="hint">Drawn before the text. Leave it blank for text only.</div>
      <div class="hint">On the face: ${t.symbol?`${t.symbol} `:""}${t.label?`${t.label}: `:""}${e.resolve(t.value)??"--"}</div>`,{color:Q.icon,icon:"icon",summary:t.symbol||"None"})}`}function Rl(e,t,n){let i=t.curvedText?"curved":"canvas",a=t.bezelGauge?"gauge":t.bezelText?"text":"none";return u`
    ${W("Main content",i,[["canvas","Layer canvas (circle)"],["curved","Big curved text"]],r=>n(o=>{r==="curved"?o.curvedText||(o.curvedText=E("Text")):(delete o.curvedText,delete o.curvedColorHex)}))}
    ${i==="curved"&&t.curvedText?u`
      ${Z(e,t.curvedText,r=>n(o=>{o.curvedText=r},"curved"),{showResolved:!0,label:"Curved text",key:"fam-corner-curved"})}
      ${he("Curved text colour",t.curvedColorHex??"#FFFFFF",r=>n(o=>{r===void 0?delete o.curvedColorHex:o.curvedColorHex=r},"curvedcolor"))}
      <div class="hint">Curved text replaces the layer canvas in the corner. The watch draws it big along the corner curve, like the stock Calendar and Weather corners.</div>
    `:m}
    ${W("Bezel",a,[["none","None (biggest circle)"],["text","Text label"],["gauge","Gauge arc"]],r=>n(o=>{r==="text"?(delete o.bezelGauge,o.bezelText||(o.bezelText=E("Label"))):r==="gauge"?(delete o.bezelText,o.bezelGauge||(o.bezelGauge={value:E("50"),minValue:0,maxValue:100,colorHexes:["#34C759","#FFCC00","#FF3B30"]})):(delete o.bezelText,delete o.bezelGauge)}))}
    ${a==="text"&&t.bezelText?u`
      ${Z(e,t.bezelText,r=>n(o=>{o.bezelText=r},"bezel"),{showResolved:!0,label:"Bezel label",key:"fam-corner-bezel"})}
      ${ue("Live countdown",t.bezelCountdown===!0,r=>n(o=>{r?o.bezelCountdown=!0:delete o.bezelCountdown}))}`:m}
    ${a==="gauge"&&t.bezelGauge?Il(e,t.bezelGauge,n):m}`}function Il(e,t,n){let i=[t.colorHexes[0]??"#34C759",t.colorHexes[1]??t.colorHexes[t.colorHexes.length-1]??"#FFCC00",t.colorHexes[t.colorHexes.length-1]??"#FF3B30"],a=r=>o=>n(l=>{let s=[...i];s[r]=o??s[r],l.bezelGauge.colorHexes=s},`gstop${r}`);return u`
    ${Z(e,t.value,r=>n(o=>{o.bezelGauge.value=r},"gvalue"),{showResolved:!0,label:"Reading",key:"fam-corner-gvalue"})}
    <div class="grid2">
      ${j("Gauge min",t.minValue,r=>n(o=>{o.bezelGauge.minValue=r??0},"gmin"),{step:1})}
      ${j("Gauge max",t.maxValue,r=>n(o=>{o.bezelGauge.maxValue=r??100},"gmax"),{step:1})}
    </div>
    ${he("Arc colour (min end)",i[0],a(0))}
    ${he("Arc colour (middle)",i[1],a(1))}
    ${he("Arc colour (max end)",i[2],a(2))}
    ${ue("End number labels",!!(t.minLabel||t.maxLabel),r=>n(o=>{let l=o.bezelGauge;r?(l.minLabel=E(String(l.minValue)),l.maxLabel=E(String(l.maxValue))):(delete l.minLabel,delete l.maxLabel)}))}
    ${t.minLabel?Z(e,t.minLabel,r=>n(o=>{o.bezelGauge.minLabel=r},"gminlab"),{label:"Min label",key:"fam-corner-gminlab"}):m}
    ${t.maxLabel?Z(e,t.maxLabel,r=>n(o=>{o.bezelGauge.maxLabel=r},"gmaxlab"),{label:"Max label",key:"fam-corner-gmaxlab"}):m}`}var ap=X.map(e=>[e,O(e)]),Ci={setColor:"Set colour",setOpacity:"Set opacity",setText:"Set text",setIcon:"Set icon",setFontSize:"Set size",setFontWeight:"Set weight",setRotation:"Set rotation",hide:"Hide",show:"Show",setGaugeValue:"Set gauge value",setGaugeMin:"Set gauge min",setGaugeMax:"Set gauge max",setBorderColor:"Set border colour",setBorderWidth:"Set border width",setBackgroundColor:"Set background colour"},Al=Object.keys(Ci);function Ml(e){let t=Yt[e];return Al.filter(n=>t.includes(le[n]))}var Ll={now:"the time",hour:"the hour",minute:"the minute",weekday:"the weekday",day:"the day",month:"the month",timestamp:"the timestamp"};function un(e,t){if(e.entityId==="")return"(no entity)";let n=e.displayName.trim();if(n!==""&&n!==e.entityId)return n;let i=t?.hass?.states[e.entityId]?.attributes.friendly_name;return typeof i=="string"&&i.trim()!==""?i.trim():e.entityId}function ct(e,t){let n=e.replace(/\s+/g," ").trim();return n.length>t?`${n.slice(0,t-1)}\u2026`:n}function zl(e){if(!e||$e(e))return"";let t=[];return e.decimals!==void 0&&t.push(`${e.decimals} dp`),e.multiply!==void 0&&t.push(`\xD7${e.multiply}`),e.offset!==void 0&&t.push(`${e.offset<0?"":"+"}${e.offset}`),e.prefix&&t.push(`"${e.prefix}" first`),e.suffix&&t.push(`"${e.suffix}" after`),e.useEntityUnit&&t.push("with unit"),e.relativeTime&&t.push("as relative time"),e.textCase&&t.push(e.textCase==="capitalized"?"Capitalized":e.textCase==="upper"?"UPPER":"lower"),t.length===0?"":` (${t.join(", ")})`}function de(e,t){return`${_l(e,t)}${zl(e.format)}`}function _l(e,t){let n=e.kind;switch(n.kind){case"literal":return n.value?`"${ct(n.value,40)}"`:"(empty)";case"entityState":return un(n,t);case"entityAttribute":return n.attribute?`${un(n,t)} \xB7 ${n.attribute}`:un(n,t);case"entityAge":return`age of ${un(n,t)}`;case"aggregate":return Hl(n.aggregate);case"time":return Ll[n.timeField];case"dataAge":return"data age";case"jinja":return n.value?`template ${ct(n.value,32)}`:"template (empty)";case"named":return n.id===""?"(no value chosen)":t?.values?.find(a=>a.id===n.id)?.name?.trim()||`named ${n.id.slice(0,8)}`}}function Hl(e){let t=e.scope.kind==="entities"?`${e.scope.entities.length} entit${e.scope.entities.length===1?"y":"ies"}`:e.scope.domains.length>0?e.scope.domains.join(" + "):"matching entities";return`${e.function} of ${t}`}function fn(e,t,n){if(n<0||n>=e.length)return;let[i]=e.splice(t,1);e.splice(n,0,i)}function Pl(e,t,n,i,a){let r=(o,l)=>e.update(s=>{let d=i(s);d&&o(d)},l?`${a}-${l}`:void 0);return u`
    ${t.length===0?u`<div class="hint">No rules yet. A rule checks values and changes how this ${n==="layout"?"family":"layer"} looks.</div>`:m}
    ${t.map((o,l)=>Nl(e,o,l,t.length,n,r,`${a}-${o.id}`))}
    <div class="adders"><button class="small" @click=${()=>r(o=>{o.push(St())})}>+ rule</button></div>
    <div class="hint">Inside a rule the first matching case wins. Across rules the later rule wins for the same property. Different properties add up.</div>`}function Nl(e,t,n,i,a,r,o){let l=e.liveBranch(t),s=e.forced.get(t.id)??"live",d=p=>s==="live"?p==="live":s==="otherwise"?p==="otherwise":s.caseId===p,c=(p,h)=>r(y=>{let g=y.find(x=>x.id===t.id);g&&p(g)},h);return u`<div class="rule-box">
    <div class="rule-head">
      <b>Rule ${n+1}</b>
      <span class="spacer"></span>
      <button class="icon" title="Move up" ?disabled=${n===0} @click=${()=>r(p=>fn(p,n,n-1))}>${z("up")}</button>
      <button class="icon" title="Move down" ?disabled=${n===i-1} @click=${()=>r(p=>fn(p,n,n+1))}>${z("down")}</button>
      <button class="icon danger" title="Delete rule" @click=${()=>r(p=>{let h=p.findIndex(y=>y.id===t.id);h>=0&&p.splice(h,1)})}>${z("delete")}</button>
    </div>
    <div class="branches">
      <span class="hint" style="margin:0 4px 0 0">Preview:</span>
      <button class=${d("live")?"active":""} @click=${()=>e.setForced(t.id,"live")}>Live</button>
      ${t.cases.map((p,h)=>u`<button class="${d(p.id)?"active":""} ${l===p.id?"live-match":""}" @click=${()=>e.setForced(t.id,{caseId:p.id})}>Case ${h+1}</button>`)}
      ${t.otherwise?u`<button class="${d("otherwise")?"active":""} ${l==="otherwise"?"live-match":""}" @click=${()=>e.setForced(t.id,"otherwise")}>Otherwise</button>`:m}
    </div>
    ${t.cases.map((p,h)=>Ol(e,p,h,t,a,c,`${o}-${p.id}`))}
    <div class="adders"><button class="small" @click=${()=>c(p=>{p.cases.push(qn())})}>+ case</button></div>
    ${ue("Otherwise (when no case matches)",t.otherwise!==void 0,p=>c(h=>{p?h.otherwise=h.otherwise??[]:delete h.otherwise}))}
    ${t.otherwise?u`<div class="case-box otherwise">
          <div class="hint">${l==="otherwise"?u`<b>Active now.</b> `:m}Changes when no case matches:</div>
          ${ao(e,t.otherwise,a,p=>c(h=>{h.otherwise&&p(h.otherwise)}),`${o}-otherwise`)}
        </div>`:m}
  </div>`}function Ol(e,t,n,i,a,r,o){let l=(d,c)=>r(p=>{let h=p.cases.find(y=>y.id===t.id);h&&d(h)},c),s=e.liveBranch(i)===t.id;return u`<div class="case-box ${s?"match":""}">
    <div class="rule-head">
      <span>Case ${n+1}${s?u` <span class="ok">· active now</span>`:m}</span>
      <span class="spacer"></span>
      <button class="icon" title="Move up" ?disabled=${n===0} @click=${()=>r(d=>fn(d.cases,n,n-1))}>${z("up")}</button>
      <button class="icon" title="Move down" ?disabled=${n===i.cases.length-1} @click=${()=>r(d=>fn(d.cases,n,n+1))}>${z("down")}</button>
      <button class="icon danger" title="Delete case" @click=${()=>r(d=>{let c=d.cases.findIndex(p=>p.id===t.id);c>=0&&d.cases.splice(c,1)})}>${z("delete")}</button>
    </div>
    <div class="row-inline">
      ${W("When",t.when.join,[["all","all of these are true"],["any","any of these is true"]],d=>l(c=>{c.when.join=d}))}
    </div>
    ${t.when.tests.length===0?u`<div class="hint">No tests: this case always matches.</div>`:m}
    ${t.when.tests.map((d,c)=>Vl(e,d,c,p=>l(h=>{let y=h.when.tests.find(g=>g.id===d.id);y&&p(y)}),()=>l(p=>{p.when.tests=p.when.tests.filter(h=>h.id!==d.id)}),`${o}-${d.id}`))}
    <div class="adders"><button class="small" @click=${()=>l(d=>{d.when.tests.push(jn())})}>+ test</button></div>
    <div class="hint" style="margin-top:8px">Then:</div>
    ${ao(e,t.then,a,d=>l(c=>d(c.then)),`${o}-then`)}
  </div>`}function Vl(e,t,n,i,a,r){let o=(p,h)=>i(p,h?`${r}-${h}`:void 0),l=t.comparison,s=We(l.kind),d=e.evaluateTest(t),c=m;switch(s){case"value":c=Z(e,l.value??E(""),p=>o(h=>{h.comparison.value=p},"rhs"),{showResolved:!0,label:"Compare with",key:`${r}-rhs`});break;case"between":c=u`${Z(e,l.value??E(""),p=>o(h=>{h.comparison.value=p},"rhs"),{showResolved:!0,label:"Lower bound",key:`${r}-rhs`})}
        ${Z(e,l.upper??E(""),p=>o(h=>{h.comparison.upper=p},"upper"),{showResolved:!0,label:"Upper bound",key:`${r}-upper`})}`;break;case"pattern":c=u`${ee("Pattern",l.pattern??"",p=>o(h=>{h.comparison.pattern=p},"pattern"),{mono:!0,placeholder:"^on$"})}
        ${l.pattern&&!Dl(l.pattern)?u`<div class="hint warn">This pattern does not compile. The test fails until it does.</div>`:m}`;break;case"options":c=ee("Options (comma separated)",(l.options??[]).join(", "),p=>o(h=>{h.comparison.options=p.split(",").map(y=>y.trim()).filter(Boolean)},"options"));break;case"none":break}return u`<div class="test-box">
    <div class="rule-head">
      <span>Test ${n+1} <span class=${d?"ok":"no"}>${d?"\u2713 true now":"\u2717 false now"}</span></span>
      <span class="spacer"></span>
      <button class="icon danger" title="Delete test" @click=${a}>${z("delete")}</button>
    </div>
    ${l.kind==="isStale"?u`<div class="hint">True when the watch's cached values are older than the staleness limit. The value below is not read.</div>`:Z(e,t.value,p=>o(h=>{h.value=p},"lhs"),{showResolved:!0,label:"Value",key:`${r}-lhs`})}
    ${W("Comparison",l.kind,Ra.map(p=>[p,st[p]]),p=>o(h=>{h.comparison=Yn(h.comparison,p)}))}
    ${c}
  </div>`}function Dl(e){try{return new RegExp(e),!0}catch{return!1}}function ao(e,t,n,i,a){let r=Ml(n);return u`
    ${t.length===0?u`<div class="hint">No changes.</div>`:m}
    ${t.map((o,l)=>Bl(e,o,l,n,(s,d)=>i(c=>{c[l]&&s(c[l])},d?`${a}-${l}-${d}`:void 0),()=>i(s=>{s.splice(l,1)}),`${a}-${l}`))}
    <select class="adder" @change=${o=>{let l=o.target,s=l.value;l.value="",s&&i(d=>{d.push(je(s))})}}>
      <option value="">+ change…</option>
      ${r.map(o=>u`<option value=${o}>${Ci[o]}</option>`)}
    </select>`}var ro=["setColor","setBorderColor","setBackgroundColor"];function Bl(e,t,n,i,a,r,o){let l=!Yt[i].includes(le[t.kind]);return u`<div class="change-box">
    <div class="rule-head">
      <span>${Ci[t.kind]}${l?u` <span class="no">(ignored by ${i==="layout"?"layouts":`${i} layers`})</span>`:m}</span>
      <span class="spacer"></span>
      <button class="icon danger" title="Delete change" @click=${r}>${z("delete")}</button>
    </div>
    ${oo(e,t,a,o)}
  </div>`}function oo(e,t,n,i){let a=Jt(t.kind),r=m;if(a==="value"){let o=t.value??E("");if(ro.includes(t.kind)){let l=o.kind.kind==="literal";r=u`${l?he("Colour",o.kind.kind==="literal"?o.kind.value:"",s=>n(d=>{d.value=E(s??"#FFFFFF")},"color")):Z(e,o,s=>n(d=>{d.value=s},"value"),{noFormat:!0,showResolved:!0,label:"Colour from",key:`${i}-value`})}
        <button class="link" @click=${()=>n(s=>{s.value=l?{kind:{kind:"entityAttribute",entityId:"",displayName:"",domain:"",attribute:"rgb_color"}}:E("#FFFFFF")})}>${l?"Read the colour from a value instead":"Use a fixed colour instead"}</button>
        ${l?m:u`<div class="hint">The value must resolve to a hex colour such as <code>#FF9F0A</code>. Empty or invalid results leave the colour unchanged.</div>`}`}else r=Z(e,o,l=>n(s=>{s.value=l},"value"),{noFormat:t.kind==="setIcon",symbol:t.kind==="setIcon",showResolved:!0,label:t.kind==="setIcon"?"Symbol":"To",key:`${i}-value`})}else if(a==="number"){let o=t.kind==="setOpacity"?{step:.05,min:0,max:1}:t.kind==="setRotation"?{step:1}:{step:.5,min:0};r=j(t.kind==="setOpacity"?"Opacity (0 to 1)":t.kind==="setRotation"?"Degrees":t.kind==="setFontSize"?"Points":"Value",t.number??0,l=>n(s=>{s.number=l??0},"number"),o)}else a==="weight"&&(r=W("Weight",t.weight??"regular",ki,o=>n(l=>{l.weight=o})));return r}var wi=new Set,hn=new Map,mn=new Map,Pr=new Map;function so(e,t,n,i,a,r){let o=hi(t);return!o.ok||wi.has(a)?u`
      <div class="states-switch">
        <button class="link" ?disabled=${!o.ok} title=${o.ok?"Go back to the table":"These rules cannot be shown as a table"}
          @click=${s=>{wi.delete(a),Ce(s.target)}}>Show as table</button>
        ${o.ok?m:u`<span class="hint">${o.reason}</span>`}
      </div>
      ${Pl(e,t,n,i,a)}`:Gl(e,o.table,t[0],n,i,a,r)}function Gl(e,t,n,i,a,r,o){let l=(C,I)=>e.update(H=>{let D=a(H);D&&C(D)},I?`${r}-${I}`:void 0),s=t.value??Pr.get(r)??o,d=t.rows.length===0,c=t.numberMode||d&&s!==void 0&&!$r(s)&&Ul(e.resolve(s)),p=Yt[i],h=hn.get(r)??new Set,y=t.columns.length===0&&h.size===0?[xr[i]]:[],g=ur(t.columns,[...h,...y.filter(C=>C!==void 0)],p),x=n?e.liveBranch(n):"none",w=n?e.forced.get(n.id)??"live":"live",T=C=>w!=="live"&&(w==="otherwise"?C==="otherwise":w.caseId===C),$=C=>{n&&e.setForced(n.id,T(C)?"live":C==="otherwise"?"otherwise":{caseId:C})},f=C=>{Pr.set(r,C),t.rows.length!==0&&l(I=>vr(I,C),"lhs")},v=()=>l(C=>gr(C,s??E(""),c)),b=t.rows.map((C,I)=>Or(e,{key:`${r}-${C.caseId}`,label:wr(C.comparison,H=>de(H,ce(e))),columns:g,changes:C.changes,live:x===C.caseId,forced:T(C.caseId),onForce:()=>$(C.caseId),when:Yl(e,C.comparison,`${r}-${C.caseId}`,(H,D)=>l(Y=>{let _=Y[0]?.cases.find(N=>N.id===C.caseId)?.when.tests[0];_&&H(_.comparison)},D&&`${C.caseId}-${D}`)),updChanges:(H,D)=>l(Y=>{let _=Y[0]?.cases.find(N=>N.id===C.caseId);_&&H(_.then)},D&&`${C.caseId}-${D}`),acts:u`
      <button class="icon" title="Move up" ?disabled=${I===0} @click=${()=>l(H=>mi(H,I,I-1))}>${z("up")}</button>
      <button class="icon" title="Move down" ?disabled=${I===t.rows.length-1} @click=${()=>l(H=>mi(H,I,I+1))}>${z("down")}</button>
      <button class="icon danger" title="Delete this state" @click=${()=>l(H=>yr(H,C.caseId))}>${z("delete")}</button>`})),F=t.otherwise===void 0?m:Or(e,{key:`${r}-otherwise`,label:"Otherwise",columns:g,changes:t.otherwise,live:x==="otherwise",forced:T("otherwise"),onForce:()=>$("otherwise"),when:u`<span class="when-otherwise">Otherwise</span>`,updChanges:(C,I)=>l(H=>{let D=H[0]?.otherwise;D&&C(D)},I),acts:u`<button class="icon" title="Remove the Otherwise row" @click=${()=>l(C=>fi(C,!1))}>${z("close")}</button>`}),M=mn.get(r),P=Kl.filter(C=>p.includes(C)&&!g.includes(C));return u`
    <div class="states">
      ${Z(e,s??E(""),f,{label:"Testing",showResolved:!0,key:`${r}-lhs`})}
      ${s===void 0?u`<div class="hint">Choose what these states look at.</div>`:m}
      <table class="states-table">
        <thead>
          <tr>
            <th class="when">When</th>
            ${g.map(C=>u`<th>
              <span>${Re[C]}</span>
              <button class="icon" title=${`Remove the ${Re[C]} column`}
                @click=${I=>{mn.set(r,C),Ce(I.target)}}>${z("close")}</button>
            </th>`)}
            <th class="acts"></th>
          </tr>
        </thead>
        <tbody>
          ${b}
          ${F}
          ${t.rows.length===0&&t.otherwise===void 0?u`<tr><td class="empty-row" colspan=${g.length+2}>No states yet. Add one to change how this ${i==="layout"?"shape":"layer"} looks when a value changes.</td></tr>`:m}
        </tbody>
      </table>
      ${M===void 0?m:u`<div class="hint warn confirm-row">
        Remove the ${Re[M]} column? Its ${Nr(t,M)} value${Nr(t,M)===1?"":"s"} are deleted from every state.
        <button class="danger small" @click=${C=>{mn.delete(r),hn.get(r)?.delete(M),Ce(C.target),l(I=>br(I,M))}}>Remove</button>
        <button class="small" @click=${C=>{mn.delete(r),Ce(C.target)}}>Cancel</button>
      </div>`}
      <div class="states-foot">
        <button class="small" @click=${v}>+ state</button>
        ${t.otherwise===void 0?u`<button class="small" title="What this layer looks like when no state above matches" @click=${()=>l(C=>fi(C,!0))}>+ otherwise</button>`:m}
        <span class="spacer"></span>
        ${w==="live"?m:u`<button class="small" @click=${()=>n&&e.setForced(n.id,"live")}>Back to live</button>`}
        ${P.length===0?m:u`<select class="chip-add" title="Add a column" @change=${C=>{let I=C.target,H=I.value;if(I.value="",!H)return;let D=hn.get(r)??new Set;D.add(H),hn.set(r,D),Ce(I)}}>
          <option value="" selected>+ column…</option>
          ${P.map(C=>u`<option value=${C}>${Re[C]}</option>`)}
        </select>`}
      </div>
      <div class="hint">${c?"States are checked top to bottom and the first match wins, so each band only has to say where it starts.":"States are checked top to bottom and the first match wins. Otherwise applies when none of them do."}</div>
      <div class="hint">Click a row to hold the previews on it, and again to go back to live.</div>
      <div class="states-switch">
        <button class="link" @click=${C=>{wi.add(r),Ce(C.target)}}>Advanced</button>
        <span class="hint">Several rules, several tests per state, or a regular expression.</span>
      </div>
    </div>`}function Ul(e){let t=(e??"").trim();return t!==""&&Number.isFinite(Number(t))}var Kl=["icon","text","color","visibility","opacity","fontSize","fontWeight","rotation","gaugeValue","gaugeMin","gaugeMax","backgroundColor","borderColor","borderWidth"];function Nr(e,t){let n=0;for(let i of e.rows)ln(i.changes,t)&&(n+=1);return e.otherwise&&ln(e.otherwise,t)&&(n+=1),n}function Wl(e){return!!e.target?.closest?.("input, select, textarea, button, label, [popover]")}function Or(e,t){return u`<tr class="state-row ${t.live?"live":""} ${t.forced?"forced":""}"
    title=${`${t.label}. Click to hold the previews on this state.`}
    @click=${n=>{Wl(n)||t.onForce()}}>
    <td class="when">
      <span class="row-flag" title=${t.forced?"The previews are held on this state":t.live?"This state matches right now":""}>${t.forced?"\u25C9":t.live?"\u25CF":""}</span>
      ${t.when}
    </td>
    ${t.columns.map(n=>u`<td>${jl(e,n,t.changes,t.updChanges,`${t.key}-${n}`)}</td>`)}
    <td class="acts">${t.acts}</td>
  </tr>`}function jl(e,t,n,i,a){let r=ln(n,t),o=$i(a);if(!r)return u`<button type="button" class="cell empty" title=${`Set ${Re[t]} for this state`}
      @click=${d=>{i(c=>{c.push(je(pr[t]))}),ll(d.target,o)}}>unchanged</button>`;let l=(d,c)=>i(p=>{let h=p.find(y=>le[y.kind]===t);h&&d(h)},c&&`${t}-${c}`),s=Re[t];return u`
    <button type="button" class="cell filled" popovertarget=${o} aria-haspopup="dialog" title=${`${s}. Click to change it.`}>${ql(e,r)}</button>
    <div class="value-pop" id=${o} popover role="dialog" aria-label=${s} @toggle=${Wr}>
      <div class="pop-head">
        <b>${s}</b>
        <span class="spacer"></span>
        <button type="button" class="small" popovertarget=${o} popovertargetaction="hide">Done</button>
      </div>
      ${Mt.has(o)?u`${t==="visibility"?W("This state",r.kind==="hide"?"hide":"show",[["show","Shown"],["hide","Hidden"]],d=>l(c=>{c.kind=d})):oo(e,r,l,a)}
          <button class="link" @click=${d=>{d.target.closest("[popover]")?.hidePopover(),i(c=>{let p=c.findIndex(h=>le[h.kind]===t);p>=0&&c.splice(p,1)})}}>Leave ${s.toLowerCase()} unchanged</button>`:m}
    </div>`}function ql(e,t){if(t.kind==="hide")return u`<span class="cell-word">Hidden</span>`;if(t.kind==="show")return u`<span class="cell-word">Shown</span>`;let n=Jt(t.kind);if(n==="number")return u`<span class="cell-word mono">${t.number??0}</span>`;if(n==="weight")return u`<span class="cell-word">${ki.find(([r])=>r===(t.weight??"regular"))?.[1]}</span>`;let i=t.value??E(""),a=i.kind.kind==="literal"?i.kind.value:void 0;if(ro.includes(t.kind))return u`<span class="swatch" style=${`background:${a&&/^#[0-9a-fA-F]{6,8}$/.test(a)?a:"transparent"}`}></span>
      <span class="cell-word">${a?be(a):de(i,ce(e))}</span>`;if(t.kind==="setIcon"&&a){let r=e.icons.render(a,16,"#FFFFFF");return u`${r??m}<span class="cell-word">${a}</span>`}return u`<span class="cell-word">${de(i,ce(e))}</span>`}function be(e){return{"#FF453A":"red","#FF9F0A":"orange","#FFD60A":"amber","#34C759":"green","#30D158":"green","#0A84FF":"blue","#64D2FF":"cyan","#BF5AF2":"purple","#FFFFFF":"white","#8E8E93":"grey","#000000":"black","#FFCC00":"amber","#FF3B30":"red"}[e.toUpperCase()]??e}function Yl(e,t,n,i){let a=We(t.kind),r=ui(t.kind),o=(l,s,d,c)=>Xl(e,l,s,`${n}-${d}`,r,c,d==="rhs"?"Compare with":"Upper bound");return u`<span class="when-cell">
    <select class="when-op" title="How this state is decided" @change=${ie(l=>i(s=>{let d=Yn(s,l);s.kind=d.kind,d.value!==void 0?s.value=d.value:delete s.value,d.upper!==void 0?s.upper=d.upper:delete s.upper}))}>
      ${pi.map(l=>u`<option value=${l} ?selected=${l===t.kind}>${Jl(l)}</option>`)}
    </select>
    ${a==="value"||a==="between"?o(t.value??E(""),l=>i(s=>{s.value=l},"rhs"),"rhs",r?"0":"value"):m}
    ${a==="between"?u`<span class="when-and">to</span>${o(t.upper??E(""),l=>i(s=>{s.upper=l},"upper"),"upper","100")}`:m}
  </span>`}function Jl(e){switch(e){case"lessThan":return"below\u2026";case"lessOrEqual":return"\u2026or below";case"between":return"between\u2026";case"greaterOrEqual":return"\u2026or above";case"greaterThan":return"above\u2026";default:return st[e]}}function Xl(e,t,n,i,a,r,o){let l=$i(i),s={showResolved:!0,label:o,key:i};if(t.kind.kind!=="literal")return u`<span class="rhs">
      ${Z(e,t,n,{...s,compact:!0})}
    </span>`;let d=t.kind.value;return u`<span class="rhs">
    <input class="cellin ${a?"num":""}" type=${a?"number":"text"} .value=${d} placeholder=${r}
      @input=${ie(c=>n({...t,kind:{kind:"literal",value:c}}))} />
    <button type="button" class="icon more" popovertarget=${l} title="Compare with an entity or a template instead">…</button>
    ${Kr(e,l,o,t,n,s)}
  </span>`}var yn=[{kind:"toggle",title:"Toggle button",blurb:"An icon that toggles the entity when tapped and looks different while it is on.",domains:Bn,layerCount:2},{kind:"status",title:"Status text",blurb:"The entity's state as one line of text, dimmed while it is unavailable.",layerCount:1},{kind:"gauge",title:"Sensor gauge",blurb:"An arc that fills with the entity's reading and changes colour across three bands.",preferNumeric:!0,layerCount:1},{kind:"camera",title:"Camera",blurb:"The camera's latest snapshot, filling the face.",domains:["camera"],layerCount:1}];function uo(e){return yn.find(t=>t.kind===e)??yn[0]}var lo="#FF9F0A",Si="#8E8E93",Zl=["#FF453A","#FFD60A","#34C759"],ho=["#0A84FF","#34C759","#FF9F0A"];function Ql(e){return e?.attributes?.device_class==="battery"?Zl:ho}var ed={light:{off:"lightbulb",on:"lightbulb.fill"},switch:{off:"power",on:"power"},fan:{off:"fan.fill",on:"fan.fill"},input_boolean:{off:"circle",on:"circle.fill"},cover:{off:"curtains.closed",on:"window.casement"},lock:{off:"lock.open.fill",on:"lock.fill"},media_player:{off:"speaker.slash.fill",on:"speaker.wave.2.fill"},siren:{off:"bell.slash.fill",on:"bell.fill"},humidifier:{off:"humidifier.fill",on:"humidifier.fill"},valve:{off:"spigot.fill",on:"spigot.fill"},automation:{off:"gearshape.fill",on:"gearshape.fill"},script:{off:"play.fill",on:"play.fill"},scene:{off:"sparkles",on:"sparkles"},climate:{off:"thermometer.medium",on:"flame.fill"},binary_sensor:{off:"circle",on:"circle.fill"},group:{off:"circle",on:"circle.fill"}};function td(e){let t=e.iconName?.trim();return t?{off:t,on:t}:ed[Ei(e)]??{off:"circle",on:"circle.fill"}}function nd(e){switch(Ei(e)){case"lock":return{kind:"equals",value:E("locked")};case"cover":case"valve":return{kind:"equals",value:E("open")};case"media_player":return{kind:"equals",value:E("playing")};default:return{kind:"isOn"}}}function Ei(e){return e.domain||e.entityId.split(".")[0]||""}function Lt(e){return{...e,domain:Ei(e)}}function id(e){let t=e?.attributes??{},n=t.min,i=t.max;if(typeof n=="number"&&typeof i=="number"&&i>n)return{min:n,max:i};let a=typeof t.device_class=="string"?t.device_class:"",r=typeof t.unit_of_measurement=="string"?t.unit_of_measurement:"";switch(a){case"battery":case"humidity":case"moisture":return{min:0,max:100};case"temperature":return r.includes("F")?{min:0,max:100}:{min:-10,max:40};default:return r==="%"?{min:0,max:100}:{min:0,max:100}}}function gn(e){return Math.round(e*1e4)/1e4}function vn(e,t,n){return Math.min(n,Math.max(t,e))}function Ti(e,t,n){let i=ae[e],a=vn(gn(t/i.width),0,1),r=vn(gn(n/i.height),0,1);return{x:gn((1-a)/2),y:gn((1-r)/2),width:a,height:r,rotationDegrees:0}}function ad(e){let t=ae[e],n=vn(Math.round(Math.min(t.width,t.height)*.55),12,30);return{frame:Ti(e,n*1.3,n*1.3),size:n}}function rd(e){let t=ae[e],n=vn(Math.round(Math.min(t.width,t.height)*.3),9,20);return{frame:Ti(e,t.width*.88,n*1.7),size:n}}function od(e){let t=ae[e],n=Math.min(t.width,t.height)*.9;return{frame:Ti(e,n,n),size:Math.max(2.5,Math.round(n*.2)/2)}}function sd(){return{frame:{x:0,y:0,width:1,height:1,rotationDegrees:0}}}function ld(e,t){t!==void 0&&(e.kind==="text"?e.payload.fontSize=t:e.kind==="icon"?e.payload.size=t:e.kind==="gauge"&&(e.payload.lineWidth=t))}function bn(e,t,n,i){let a=i(n);t.payload.frame=a.frame,ld(t,a.size);for(let r of X){if(r===n||r==="inline")continue;let o=e.perFamily[r];if(!o)continue;let l=i(r);JSON.stringify(l)!==JSON.stringify(a)&&(o.placements[t.payload.id]={frame:l.frame,isHidden:!1,...l.size!==void 0?{size:l.size}:{}})}}function wn(e){return Ct(e)}function Fi(e,t){let n={kind:{kind:"entityState",...Lt(e)}},i=t?.attributes?.unit_of_measurement;return typeof i=="string"&&i.trim()!==""&&(n.format={useEntityUnit:!0}),n}function co(e){let t=je("setIcon");return t.value=E(e),t}function Je(e){let t=je("setColor");return t.value=E(e),t}function dd(e,t){let n=St(),i=n.cases[0],a=i.when.tests[0];a.value={kind:{kind:"entityState",...Lt(e)}},a.comparison=nd(e);let r=t.on!==t.off;return i.then=r?[co(t.on),Je(lo)]:[Je(lo)],n.otherwise=r?[co(t.off),Je(Si)]:[Je(Si)],n}function cd(e){let t=St(),n=t.cases[0],i=n.when.tests[0];i.value={kind:{kind:"entityState",...Lt(e)}},i.comparison={kind:"isUnavailable"};let a=je("setOpacity");return a.number=.35,n.then=[a],t}function po(e){let t=Math.abs(e)>=10?Math.round(e):Math.round(e*10)/10;return String(t)}function pd(e,t,n=ho){let i=t.max-t.min,a=po(t.min+i/3),r=po(t.min+i*2/3),o=[{comparison:{kind:"lessThan",value:E(a)},changes:[Je(n[0])]},{comparison:{kind:"between",value:E(a),upper:E(r)},changes:[Je(n[1])]},{comparison:{kind:"greaterThan",value:E(r)},changes:[Je(n[2])]}];return hr(Fi(e),o)}function ud(e,t,n){let i=wn("icon"),a=td(t);return i.payload.symbol=E(a.off),i.payload.colorSlot.baseColorHex=Si,i.payload.rules=[dd(t,a)],bn(e,i,n.family,ad),e.elements.push(i),jt(e,i.payload.id,{type:"toggleEntity",...Lt(t)}),i.payload.id}function hd(e,t,n){let i=wn("text");return i.payload.value=Fi(t,n.state),i.payload.rules=[cd(t)],bn(e,i,n.family,rd),e.elements.push(i),i.payload.id}function md(e,t,n){let i=wn("gauge");i.payload.value=Fi(t);let a=id(n.state);return i.payload.minValue=a.min,i.payload.maxValue=a.max,i.payload.rules=[pd(t,a,Ql(n.state))],bn(e,i,n.family,od),e.elements.push(i),i.payload.id}function fd(e,t,n){let i=wn("image");return i.payload.entity=Lt(t),bn(e,i,n.family,sd),e.elements.push(i),i.payload.id}function mo(e,t,n,i){switch(t){case"toggle":return ud(e,n,i);case"status":return hd(e,n,i);case"gauge":return md(e,n,i);case"camera":return fd(e,n,i)}}var yd=3e4,vd=500,fo="preset-entity",bd={ArrowLeft:{dx:-1,dy:0},ArrowRight:{dx:1,dy:0},ArrowUp:{dx:0,dy:-1},ArrowDown:{dx:0,dy:1}};function Ri(e){return"id"in e?`${e.kind}:${e.id}`:e.kind}function wd(e){return e.kind==="family"?"look":"content"}function xd(e){let t=e.document?.supportedFamilies;return Array.isArray(t)?t.filter(n=>typeof n=="string"):[]}var go=300,yo=400,Ii=52,vo=36,Xe=200,$d=720,xn=320,kd=80,Cd=56,bo="wrist-assistant-panel.columns.v2",Ai=e=>Math.max(Xe,Math.min($d,Math.round(e))),wo=e=>e.metaKey||e.ctrlKey||e.shiftKey,xo=typeof navigator<"u"&&/Mac|iPhone|iPad/.test(navigator.platform)?"Cmd":"Ctrl";function $o(e,t,n){if(e<=0)return{columns:3,left:t,right:n};let i=e-kd;if(i>=Xe*2+xn){let r=i-xn,o=t,l=n;if(o+l>r){let s=r/(o+l);o=Math.max(Xe,Math.floor(o*s)),l=Math.max(Xe,Math.floor(l*s));let d=o+l-r;d>0&&(o>=l?o=Math.max(Xe,o-d):l=Math.max(Xe,l-d))}return{columns:3,left:o,right:l}}let a=e-Cd;return a>=Xe+xn?{columns:2,left:Math.min(t,a-xn),right:n}:{columns:1,left:t,right:n}}var R=class extends Ae{constructor(){super(...arguments);this.narrow=!1;this.colLeft=go;this.colRight=yo;this.panelWidth=0;this.owners=[];this.records=[];this.maxSchemaVersion=6;this.presets=[];this.occupied=[];this.serverToken=0;this.polling=!1;this.sendPending=!1;this.pages=[];this.templateResults=new Map;this.forced=new Map;this.showRaw=!1;this.inspect={kind:"general"};this.openSections=new Set(["content"]);this.pickerOpen=!1;this.testValues=new Map;this.multi=new Set;this.collapsed=new Set;this.activeFamily="rectangular";this.picking=!1;this.showTaps=!1;this.newShapeChooser=!1;this.previewCase=Ft.label;this.saving=!1;this.confirmDelete=!1;this.moving=!1;this.version=0;this.icons=rr(()=>this.requestUpdate());this.imageSizes=or(()=>this.requestUpdate());this.symbols=new rn(()=>this.requestUpdate());this.keyHandler=n=>this.onKey(n);this.heldArrows=new Set;this.keyUpHandler=n=>{this.heldArrows.delete(n.key)&&this.heldArrows.size===0&&this.draft?.endGesture()};this.sizeObserver=new ResizeObserver(n=>{let i=n[0]?.contentRect.width??0;Math.abs(i-this.panelWidth)>=1&&(this.panelWidth=i)});this.beforeUnload=n=>{this.draft?.dirty&&n.preventDefault()};this.pickerOutside=n=>{n.composedPath().some(a=>a instanceof HTMLElement&&a.classList.contains("picker"))||this.togglePicker(!1)};this.presetKeys={handleEvent:n=>{n.key==="Enter"&&(this.presetEntity===void 0||Gr(fo)||(n.preventDefault(),n.stopPropagation(),this.createFromPreset()))},capture:!0}}static{this.styles=kn`
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
      --wa-text: ${oe(Q.text)};
      --wa-icon: ${oe(Q.icon)};
      --wa-gauge: ${oe(Q.gauge)};
      --wa-shape: ${oe(Q.shape)};
      --wa-image: ${oe(Q.image)};
      --wa-tap: ${oe(Q.tap)};
      --wa-states: ${oe(U.states)};
      --wa-place: ${oe(U.place)};
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
      display: grid; grid-template-columns: 16px 4px ${Ii}px minmax(0, 1fr) auto; align-items: center; gap: 8px;
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
      width: ${Ii}px; height: ${vo}px; border-radius: 8px; overflow: hidden; flex: none;
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
    .layer .lockbtn.on { opacity: 1; color: ${oe(U.locked)}; filter: drop-shadow(0 0 4px ${oe(U.locked)}); }
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
  `}connectedCallback(){super.connectedCallback(),this.loadColumnWidths(),this.sizeObserver.observe(this),window.addEventListener("keydown",this.keyHandler),window.addEventListener("keyup",this.keyUpHandler),window.addEventListener("beforeunload",this.beforeUnload),this.loadOwners()}loadColumnWidths(){try{let n=window.localStorage.getItem(bo);if(!n)return;let i=JSON.parse(n);typeof i.left=="number"&&(this.colLeft=Ai(i.left)),typeof i.right=="number"&&(this.colRight=Ai(i.right))}catch{}}saveColumnWidths(){try{window.localStorage.setItem(bo,JSON.stringify({left:this.colLeft,right:this.colRight}))}catch{}}renderGutter(n){return u`<div class="gutter ${n}" role="separator" aria-orientation="vertical"
      title="Drag to resize. Double-click to reset."
      @pointerdown=${i=>this.beginColumnDrag(n,i)}
      @dblclick=${()=>{n==="left"?this.colLeft=go:this.colRight=yo,this.saveColumnWidths()}}></div>`}beginColumnDrag(n,i){if(i.button!==0)return;i.preventDefault();let a=i.currentTarget,r=i.clientX,o=$o(this.panelWidth,this.colLeft,this.colRight),l=n==="left"?o.left:o.right;a.setPointerCapture(i.pointerId),a.classList.add("dragging");let s=p=>{if(p.pointerId!==i.pointerId)return;let h=p.clientX-r,y=Ai(n==="left"?l+h:l-h);n==="left"?this.colLeft=y:this.colRight=y},d=p=>{p.pointerId===i.pointerId&&(c(),this.saveColumnWidths())},c=()=>{a.classList.remove("dragging"),a.removeEventListener("pointermove",s),a.removeEventListener("pointerup",d),a.removeEventListener("pointercancel",d);try{a.releasePointerCapture(i.pointerId)}catch{}};a.addEventListener("pointermove",s),a.addEventListener("pointerup",d),a.addEventListener("pointercancel",d)}disconnectedCallback(){super.disconnectedCallback(),this.sizeObserver.disconnect(),window.removeEventListener("keydown",this.keyHandler),window.removeEventListener("keyup",this.keyUpHandler),window.removeEventListener("beforeunload",this.beforeUnload),this.unsubscribe?.(),this.templateTimer&&window.clearInterval(this.templateTimer),this.debounceTimer&&window.clearTimeout(this.debounceTimer),this.countdownTimer!==void 0&&window.clearInterval(this.countdownTimer),this.sendTimer!==void 0&&window.clearTimeout(this.sendTimer),this.cancelGesture?.()}syncCountdownTicker(n){let i=[n.rectangular,n.circular,n.corner].filter(r=>r!==void 0),a=n.inline?.countdownEnd!==void 0||i.some(r=>r.bezelCountdownEnd!==void 0||r.elements.some(o=>o.kind==="text"&&o.countdownEnd!==void 0));a&&this.countdownTimer===void 0?this.countdownTimer=window.setInterval(()=>this.requestUpdate(),1e3):!a&&this.countdownTimer!==void 0&&(window.clearInterval(this.countdownTimer),this.countdownTimer=void 0)}willUpdate(n){if(n.has("hass")){let i=this.hass?.themes?.darkMode??window.matchMedia?.("(prefers-color-scheme: dark)").matches??!1;this.toggleAttribute("dark",i)}if(n.has("inspect")){let i=n.get("inspect");(i===void 0||Ri(i)!==Ri(this.inspect))&&(this.openSections=new Set(xi))}}updated(n){let i=Ri(this.inspect);if(i!==this.lastInspectKey){this.lastInspectKey=i;let a=this.renderRoot.querySelector(".column.inspector");a&&(a.scrollTop=0)}if(n.has("pickHoverId")&&this.pickHoverId!==void 0&&this.renderRoot.querySelector(".layer.pick")?.scrollIntoView({block:"nearest"}),n.has("hass")&&this.draft){let a={};for(let l of this.compiled?.entities.keys()??[])a[l]=this.hass.states[l]?.last_updated;let r=JSON.stringify(this.lastStatesSnapshot??{}),o=JSON.stringify(a);r!==o&&(this.lastStatesSnapshot=a,this.requestUpdate())}}onKey(n){if(n.key==="Escape"&&this.picking){n.preventDefault(),this.togglePicking(!1);return}n.key==="Escape"&&(this.timestampActiveId=void 0);let i=n.composedPath()[0],a=!!i?.tagName?.match(/INPUT|TEXTAREA|SELECT/)||i?.isContentEditable===!0,r=bd[n.key];if(r&&!a&&!n.metaKey&&!n.ctrlKey&&!n.altKey){this.nudge(r.dx,r.dy,n.shiftKey)&&(n.preventDefault(),this.heldArrows.add(n.key));return}(n.metaKey||n.ctrlKey)&&(n.key==="s"?(n.preventDefault(),this.save()):n.key==="z"&&!a?(n.preventDefault(),n.shiftKey?this.redo():this.undo()):n.key==="y"&&!a&&(n.preventDefault(),this.redo()))}get canEdit(){return!!this.hass.user?.is_admin&&!this.readOnlyReason&&!!this.draft}async loadOwners(){try{let n=await Yi(this.hass);if(this.owners=n.owners,this.maxSchemaVersion=n.max_schema_version,this.loadError=void 0,!this.ownerId&&this.owners.length>0){let i=this.owners.find(a=>a.complication_count>0)??this.owners[0];await this.selectOwner(i.owner_watch_id)}}catch(n){this.loadError=`Could not load devices: ${Pe(n)}`}}async selectOwner(n){if(this.draft?.dirty&&!this.confirmDiscard()){this.requestUpdate();return}this.ownerId=n,this.selectedId=void 0,this.moveTarget=void 0,this.moveError=void 0;let i=Ua(this.owners.find(a=>a.owner_watch_id===n)?.screen_size);i&&(this.previewCase=i.label),this.clearDraft(),await this.unsubscribe?.(),this.unsubscribe=await ta(this.hass,n,()=>{this.loadRecords()}),await this.loadRecords()}async loadRecords(){if(this.ownerId)try{let n=await Ji(this.hass,this.ownerId);this.records=n.records,this.maxSchemaVersion=n.max_schema_version,this.presets=n.presets??[],this.occupied=n.occupied??this.presets.map(a=>({slot:a.slot,name:a.name,kind:"preset",home:""})),this.pages=n.pages??[],this.serverToken=n.token,this.appliedToken=n.applied_token,this.polling=n.polling??!1,this.appliedToken===this.serverToken&&this.endSendWait();let i=this.records.find(a=>a.id===this.selectedId);i?this.draft&&this.draft.dirty?this.remoteRevision=i.revision!==this.draft.baseRevision?i.revision:void 0:this.draft&&i.revision!==this.draft.baseRevision&&this.openRecord(i):this.draft&&this.selectedId&&this.draft.baseRevision!==null?this.draft.dirty?this.remoteRevision=-1:this.selectFirst():this.draft||this.selectFirst()}catch(n){this.loadError=`Could not load complications: ${Pe(n)}`}}selectFirst(){this.records[0]?this.openRecord(this.records[0]):(this.selectedId=void 0,this.clearDraft())}clearDraft(){this.draft=void 0,this.compiled=void 0,this.compiledDocument=void 0,this.readOnlyReason=void 0,this.parseError=void 0,this.remoteRevision=void 0,this.conflict=void 0,this.saveError=void 0,this.confirmDelete=!1}confirmDiscard(){return window.confirm("You have unsaved changes. Discard them?")}selectRecord(n){n.id!==this.selectedId&&(this.draft?.dirty&&!this.confirmDiscard()||this.openRecord(n))}openRecord(n){this.selectedId=n.id,this.clearDraft(),this.forced=new Map,this.inspect={kind:"general"};try{this.draft=qe.fromDocument(n.document,n.revision),this.savedName=String(n.document?.name??"");let i=Number(n.document?.schemaVersion??0),a=wa(n.document);i>this.maxSchemaVersion?this.readOnlyReason=`This document is schema v${i}; this integration understands up to v${this.maxSchemaVersion}. Update the Wrist Assistant integration to edit it.`:a.length>0&&(this.readOnlyReason=`This document has fields the panel does not understand, so saving would drop them: ${a.slice(0,5).join(", ")}${a.length>5?` and ${a.length-5} more`:""}. Update the integration to edit it.`),this.recompile(),this.ensureActiveFamily()}catch(i){this.parseError=Pe(i)}this.scheduleTemplates(0)}startNew(n){this.draft?.dirty&&!this.confirmDiscard()||(this.selectedId=n.id,this.clearDraft(),this.forced=new Map,this.inspect={kind:"general"},this.savedName=void 0,this.draft=new qe(n,null),this.recompile(),this.ensureActiveFamily(),this.scheduleTemplates(0))}freeSlot(){return pa(this.records.map(n=>Number(n.document?.slotIndex??-1)),this.occupied)}beginSendWait(){this.sendTimer!==void 0&&window.clearTimeout(this.sendTimer),this.sendPending=!0,this.sendTimer=window.setTimeout(()=>{this.sendTimer=void 0,this.sendPending=!1,this.loadRecords()},1e4)}endSendWait(){this.sendTimer!==void 0&&window.clearTimeout(this.sendTimer),this.sendTimer=void 0,this.sendPending=!1}async sendToWatch(){if(this.ownerId)try{let n=await Xi(this.hass,this.ownerId);this.polling=n.polling,this.serverToken=n.token,this.appliedToken=n.applied_token,n.applied_token!==n.token&&this.beginSendWait()}catch(n){this.saveError=Pe(n)}}renderSendButton(){let n=Ia({token:this.serverToken,appliedToken:this.appliedToken,polling:this.polling,pending:this.sendPending});if(n.kind==="unsupported")return m;let i=Aa(n),a=i.resend&&this.hass.user?.is_admin?u`<button class="link" title="Wake the watch again" @click=${()=>{this.sendToWatch()}}>Resend</button>`:m;return u`<span class="send ${n.kind}" title=${i.title}>${n.kind==="sent"?"\u2713 ":""}${i.label}${a}</span>`}get slotChosen(){let n=this.draft?.config.slotIndex??-1;return n>=0&&n<Hn}mutate(n,i){!this.draft||!this.canEdit||(this.draft.update(n,i),this.afterMutation())}afterMutation(){this.version++,this.recompile(),this.ensureActiveFamily()}recompile(){if(this.draft){try{this.compiled=Zn(this.draft.config)}catch{this.compiled=void 0}this.lastStatesSnapshot=void 0,this.compiled?.document!==this.compiledDocument&&(this.compiledDocument=this.compiled?.document,this.scheduleTemplates(vd))}}undo(){this.draft?.canUndo&&(this.draft.undo(),this.afterMutation())}redo(){this.draft?.canRedo&&(this.draft.redo(),this.afterMutation())}host(){let n=new Fe(this.buildContext());return{hass:this.hass,config:this.draft.config,icons:this.icons,symbols:this.symbols,pages:this.pages,update:(i,a)=>this.mutate(i,a),endGesture:()=>this.draft?.endGesture(),resolve:i=>n.resolve(i),evaluateTest:i=>n.evaluateTest(i),liveBranch:i=>n.liveBranches([i]).get(i.id)??"none",forced:this.forced,setForced:(i,a)=>this.setForced(i,a),activeFamily:this.activeFamily,setActiveFamily:i=>{this.activeFamily=i,this.inspect={kind:"family"}},addFamily:i=>this.addShape(i),removeFamily:i=>this.removeShape(i),savedName:this.savedName,tapAreaShown:this.showTaps,showTapArea:i=>this.setShowTaps(i),openSections:this.openSections,toggleSection:i=>this.toggleSection(i)}}toggleSection(n){let i=new Set(this.openSections);i.has(n)?i.delete(n):(i.size<=1&&i.clear(),i.add(n)),this.openSections=i}get watchSupported(){let n=this.selectedOwner;return n?n.is_orphan||nr(n.app_version):!0}get canvasFamily(){if(Rt(this.activeFamily))return this.activeFamily;let n=this.draft?.config;return(n&&Ja(n))??"rectangular"}ensureActiveFamily(){let n=this.draft?.config;!n||n.supportedFamilies.includes(this.activeFamily)||(this.activeFamily=Ya(n)[0]??"rectangular")}addShape(n){this.mutate(i=>Xa(i,n)),this.activeFamily=n,this.inspect={kind:"family"}}removeShape(n){let i=this.draft?.config;if(!i||!rt(i,n))return;let a=Qa(i,n);a.length>0&&!window.confirm(`Remove the ${O(n)} layout? This drops ${a.join(", ")}.`)||(this.mutate(r=>Za(r,n)),this.ensureActiveFamily())}createNew(n){this.newShapeChooser=!1,this.startNew(xa("New complication",this.freeSlot(),[n]))}setForced(n,i){let a=new Map(this.forced);i==="live"?a.delete(n):a.set(n,i),this.forced=a}async save(n=!1){if(!(!this.draft||!this.ownerId||!this.canEdit||this.saving)&&!(!n&&!this.draft.dirty)){if(!n&&!this.slotChosen){this.saveError="The watch is full. Delete a complication first.";return}this.saving=!0,this.saveError=void 0;try{let i=this.draft;if(n){let o=this.freeSlot();if(o<0){this.saveError="The watch is full (iPhone presets count too), so there is nowhere to put a copy. Delete a complication first.";return}let l=structuredClone(i.config);l.id=q(),l.slotIndex=o,i=new qe(l,null)}let a=i.encoded(),r=await Zi(this.hass,this.ownerId,a,i.baseRevision);if(!r.ok||!r.record){r.error==="conflict"?this.conflict={current:r.current??null,message:r.message??"Someone else saved this complication first."}:this.saveError=r.message??r.error??"Save failed";return}this.conflict=void 0,this.remoteRevision=void 0,this.selectedId=r.record.id,this.draft=qe.fromDocument(r.record.document,r.record.revision),this.savedName=String(r.record.document?.name??""),this.recompile(),this.beginSendWait(),await this.loadRecords()}catch(i){this.saveError=Pe(i)}finally{this.saving=!1}}}async deleteCurrent(){if(!(!this.draft||!this.ownerId||!this.selectedId||!this.canEdit)){if(this.draft.baseRevision===null){this.clearDraft(),this.selectedId=void 0,this.selectFirst();return}this.saving=!0;try{let n=await Qi(this.hass,this.ownerId,this.selectedId,this.draft.baseRevision);if(!n.ok){n.error==="conflict"?this.conflict={current:n.current??null,message:n.message??"This complication changed on the server."}:this.saveError=n.message??n.error??"Delete failed";return}this.clearDraft(),this.selectedId=void 0,await this.loadRecords()}catch(n){this.saveError=Pe(n)}finally{this.saving=!1,this.confirmDelete=!1}}}duplicate(){if(!this.draft)return;let n=structuredClone(this.draft.config);n.id=q(),n.name=`${n.name} copy`,n.slotIndex=this.freeSlot(),this.startNew(n)}reloadFromServer(){let n=this.conflict?.current??this.records.find(i=>i.id===this.selectedId);this.conflict=void 0,n&&!n.deleted?this.openRecord(n):(this.clearDraft(),this.selectedId=void 0,this.loadRecords())}get selectedOwner(){return this.owners.find(n=>n.owner_watch_id===this.ownerId)}async moveAll(){let n=this.ownerId,i=this.moveTarget;if(!(!n||!i||this.moving)){this.moving=!0,this.moveError=void 0;try{await ea(this.hass,n,i),this.moveTarget=void 0,await this.loadOwners(),await this.selectOwner(i)}catch(a){this.moveError=Pe(a)}finally{this.moving=!1}}}scheduleTemplates(n){this.debounceTimer&&window.clearTimeout(this.debounceTimer),this.debounceTimer=window.setTimeout(()=>{this.refreshTemplates()},n),this.templateTimer&&window.clearInterval(this.templateTimer),this.templateTimer=window.setInterval(()=>{this.refreshTemplates()},yd)}async refreshTemplates(){let n=this.compiled?.document;if(!n){this.templateResults=new Map,this.templateError=void 0,this.templateFetchedAt=Date.now();return}try{let a=(await na(this.hass,{doc:n})).doc;if(!a)return;if(!a.ok){this.templateError=a.error;return}let r=_a(a.value);if(!r){this.templateError="Template did not render to a JSON object";return}this.templateResults=r.values,this.templateError=void 0,this.templateFetchedAt=Date.now()}catch(i){this.templateError=Pe(i)}}buildContext(){let n=new Map;for(let i of this.compiled?.entities.keys()??[]){let a=this.hass.states[i];if(!a)continue;let r=a.attributes,o=i.split(".")[0]??"",l={entityId:i,state:this.testValues.get(i)??a.state,unitOfMeasurement:typeof r.unit_of_measurement=="string"?r.unit_of_measurement:void 0,iconName:this.compiled?.entities.get(i)?.iconName??"",domain:o};if(o==="timer"){l.timerState=a.state,typeof r.finishes_at=="string"&&(l.finishesAt=r.finishes_at);let s=Sd(r.remaining);s!==void 0&&(l.remaining=s)}o==="camera"&&typeof r.entity_picture=="string"&&(l.entityPicture=r.entity_picture),n.set(i,l)}return{entityStates:n,templateResults:this.templateResults,namedValues:this.draft?.config.values??[],dataAgeSeconds:this.templateFetchedAt===void 0?void 0:(Date.now()-this.templateFetchedAt)/1e3}}renderPickButton(){let n=this.picking,i=!this.draft||this.parseError!==void 0;return u`<button class="pick ${n?"on":""}" ?disabled=${i}
      aria-pressed=${n?"true":"false"}
      title=${n?"Point at the face to name a layer. Click one to select it. Escape stops.":"Point at a layer on the face to find it (Escape stops)"}
      @click=${()=>this.togglePicking()}><span class="glyph">⌖</span>${n?"Picking\u2026":"Pick layer"}</button>`}renderShowTapsButton(){let n=this.showTaps;return u`<button class="pick ${n?"on":""}" ?disabled=${!this.draft||this.parseError!==void 0}
      aria-pressed=${n?"true":"false"}
      title="Show every tap area, labelled with what it does, over a dimmed face. With a layer selected, only its tap area shows, and you can drag its corners to size it."
      @click=${()=>this.setShowTaps(!this.showTaps)}><span class="glyph">☞</span>Show taps</button>`}setShowTaps(n){this.showTaps=n,n&&this.togglePicking(!1)}togglePicking(n=!this.picking){this.picking=n,this.pickHoverId=void 0,n&&(this.showTaps=!1,this.cancelGesture?.())}hitLayerId(n){let i=this.draft?.config;if(!i)return;let r=n.target?.closest?.("[data-element-id]")?.getAttribute("data-element-id");return r?Kn(i,r):void 0}onPickMove(n){this.picking&&(this.pickHoverId=this.hitLayerId(n))}pickAt(n,i){let a=this.hitLayerId(i);this.togglePicking(!1),a&&(n!==this.activeFamily&&(this.activeFamily=n),this.inspect={kind:"layer",id:a})}onPreviewPointerDown(n,i){if(this.picking){i.preventDefault(),this.pickAt(n,i);return}let a=i.target,r=a.closest("[data-handle]")?.getAttribute("data-handle"),o=a.closest("[data-element-id]")?.getAttribute("data-element-id")??void 0,l=a.closest("svg"),s=a.closest("[data-ts-corner]")?.getAttribute("data-ts-corner")??null,d=s!==null||a.closest("[data-ts-handle]")!==null;if(d||(this.timestampActiveId=void 0),this.showTaps){let w=this.focusTapId();if(w!==void 0&&o===w&&l&&this.draft&&this.canEdit){if(n!==this.activeFamily){this.activeFamily=n;return}i.preventDefault(),this.beginTapBoxGesture(n,i,l,w,r??void 0);return}let T=this.hitLayerId(i);T?this.inspect={kind:"layer",id:T}:o===void 0&&(this.inspect={kind:"general"});return}if(!this.draft||!this.canEdit)return;if(n!==this.activeFamily){this.activeFamily=n;return}let c=wo(i);if(!c&&this.multi.size>0&&(this.multi=new Set),!o||!l)return;let p=Kn(this.draft.config,o),h=this.draft.config.elements.find(w=>w.payload.id===p);if(!p||!h)return;if(c){i.preventDefault(),this.togglePick(p);return}let y=Ue(this.draft.config,p);if(y?.locked&&!r&&!d){this.beginGroupGesture(n,i,l,y);return}if((this.inspect.kind!=="layer"||this.inspect.id!==p)&&(this.inspect={kind:"layer",id:p},r))return;i.preventDefault();let g=me(this.draft.config,n,h).frame,x=this.gestureCanvas(n);if(d&&h.kind==="image"&&h.payload.timestamp===!0){this.timestampActiveId=p;let w=h.payload,T=ge[n],$=g.width*T.width,f=g.height*T.height,v={x:0,y:0,w:$,h:f,cx:$/2,cy:f/2},b=tn(w,v,en(new Date));if(this.cancelGesture?.(),s){let C=x.width/T.width,I=w.timestampSize;this.cancelGesture=Tr(l,i,s,{w:b.w*C,h:b.h*C},(H,D)=>{let Y=Math.min(40,Math.max(4,Math.round(I*H)));this.mutate(_=>{let N=_.elements.find(te=>te.payload.id===p);N?.kind==="image"&&(N.payload.timestampSize=Y)},`ts-size-${p}`),D&&(this.draft?.endGesture(),this.cancelGesture=void 0)});return}let F={x:0,y:0,w:g.width*x.width,h:g.height*x.height},M=Ee(w)?{x:w.timestampX,y:w.timestampY}:{x:(b.x+b.w/2)/v.w,y:(b.y+b.h/2)/v.h},P=!1;this.cancelGesture=Er(l,F,i,M,(C,I,H)=>{H||(P=!0),P&&this.mutate(D=>{let Y=D.elements.find(_=>_.payload.id===p);Y?.kind==="image"&&(Y.payload.timestampX=C,Y.payload.timestampY=I)},`ts-${p}`),H&&(this.draft?.endGesture(),this.cancelGesture=void 0)});return}this.cancelGesture?.(),this.cancelGesture=cn(l,x,i,{elementId:p,frame:g,handle:r??void 0},{onFrame:(w,T,$)=>{this.mutate(f=>pe(f,n,w,{frame:T}),`drag-${w}-${n}`),$&&(this.draft?.endGesture(),this.cancelGesture=void 0)}})}beginGroupGesture(n,i,a,r){let o=this.draft?.config;if(!o)return;let l=Le(o,r.id);if(l.length===0)return;(this.inspect.kind!=="group"||this.inspect.id!==r.id)&&(this.inspect={kind:"group",id:r.id}),i.preventDefault();let s=new Map(l.map(w=>[w.payload.id,me(o,n,w).frame])),d=[...s.values()],c=Math.min(...d.map(w=>w.x)),p=Math.min(...d.map(w=>w.y)),h=Math.max(...d.map(w=>w.x+w.width)),y=Math.max(...d.map(w=>w.y+w.height)),g={x:c,y:p,width:h-c,height:y-p,rotationDegrees:0},x=w=>Math.round(w*1e3)/1e3;this.cancelGesture?.(),this.cancelGesture=cn(a,this.gestureCanvas(n),i,{elementId:r.id,frame:g},{onFrame:(w,T,$)=>{let f=T.x-g.x,v=T.y-g.y;this.mutate(b=>{for(let[F,M]of s)pe(b,n,F,{frame:{...M,x:x(M.x+f),y:x(M.y+v)}})},`drag-group-${r.id}-${n}`),$&&(this.draft?.endGesture(),this.cancelGesture=void 0)}})}nudge(n,i,a){let r=this.draft?.config;if(!r||!this.canEdit||this.showTaps||this.picking)return!1;let o=a?Cr:1,l=n*o,s=i*o,d=this.canvasFamily,c=ge[d];if(this.timestampActiveId!==void 0&&this.nudgeTimestamp(this.timestampActiveId,d,l,s))return!0;if(this.multi.size>=2)return this.nudgeMany([...this.multi],d,c,`nudge-multi-${d}`,l,s);if(this.inspect.kind==="group"){let w=this.inspect.id;return this.nudgeMany(Le(r,w).map(T=>T.payload.id),d,c,`nudge-group-${w}-${d}`,l,s)}if(this.inspect.kind!=="layer")return!1;let p=this.inspect.id,h=r.elements.find(w=>w.payload.id===p);if(!h)return!1;let y=Ue(r,p);if(y?.locked)return this.nudgeMany(Le(r,y.id).map(w=>w.payload.id),d,c,`nudge-group-${y.id}-${d}`,l,s);let g=me(r,d,h).frame,x=gi(g,l,s,c);return(x.x!==g.x||x.y!==g.y)&&this.mutate(w=>pe(w,d,p,{frame:x}),`nudge-${p}-${d}`),!0}nudgeMany(n,i,a,r,o,l){let s=this.draft?.config;if(!s)return!1;let d=v=>Math.round(v*1e3)/1e3,c=new Map;for(let v of n){let b=s.elements.find(F=>F.payload.id===v);b&&c.set(v,me(s,i,b).frame)}if(c.size===0)return!1;let p=[...c.values()],h=Math.min(...p.map(v=>v.x)),y=Math.min(...p.map(v=>v.y)),g=Math.max(...p.map(v=>v.x+v.width)),x=Math.max(...p.map(v=>v.y+v.height)),w={x:h,y,width:g-h,height:x-y,rotationDegrees:0},T=gi(w,o,l,a),$=T.x-w.x,f=T.y-w.y;return($!==0||f!==0)&&this.mutate(v=>{for(let[b,F]of c)pe(v,i,b,{frame:{...F,x:d(F.x+$),y:d(F.y+f)}})},r),!0}nudgeTimestamp(n,i,a,r){let o=this.draft?.config,l=o?.elements.find(w=>w.payload.id===n);if(!o||l?.kind!=="image"||l.payload.timestamp!==!0)return!1;let s=l.payload,d=ge[i],c=me(o,i,l).frame,p=c.width*d.width,h=c.height*d.height,y=tn(s,{x:0,y:0,w:p,h,cx:p/2,cy:h/2},en(new Date)),g=Ee(s)?{x:s.timestampX,y:s.timestampY}:{x:p>0?(y.x+y.w/2)/p:.5,y:h>0?(y.y+y.h/2)/h:.5},x=Sr(g,a,r,{w:p,h});return(x.x!==g.x||x.y!==g.y)&&this.mutate(w=>{let T=w.elements.find($=>$.payload.id===n);T?.kind==="image"&&(T.payload.timestampX=x.x,T.payload.timestampY=x.y)},`nudge-ts-${n}`),!0}gestureCanvas(n){let i=Qt(this.previewSlot(n),n);if(n!=="corner")return{width:i.width,height:i.height};let a=this.draft?.config.perFamily.corner,r=!!a?.bezelText||!!a?.bezelGauge,o=si(i.scale,r);return{width:o,height:o}}focusTapId(){let n=this.draft?.config;if(!n||!this.showTaps||this.inspect.kind!=="layer")return;let i=this.inspect.id,a=n.elements.find(r=>r.payload.id===i);if(a)return a.kind==="tap"?a.payload.id:ye(n,i)[0]?.payload.id}beginTapBoxGesture(n,i,a,r,o){let l=this.draft?.config,s=l?.elements.find(p=>p.payload.id===r);if(!l||!s)return;let d=se(l,s),c=me(l,n,s).frame;this.cancelGesture?.(),this.cancelGesture=cn(a,this.gestureCanvas(n),i,{elementId:r,frame:c,handle:o},{onFrame:(p,h,y)=>{this.mutate(g=>{d?Ca(g,p,n,h):pe(g,n,p,{frame:h})},`tap-box-${p}-${n}`),y&&(this.draft?.endGesture(),this.cancelGesture=void 0)}})}render(){let n=this.draft,i=!!n?.dirty,a=this.narrow?{columns:1,left:this.colLeft,right:this.colRight}:$o(this.panelWidth,this.colLeft,this.colRight);return u`
      <header>
        <h1><span class="mark">${z("watch")}</span>Wrist Assistant</h1>
        ${this.renderPicker()}
        ${i?u`<span class="dirty-dot" title="Unsaved changes"></span>`:m}
        <div class="toolbar">
          <button @click=${()=>this.undo()} ?disabled=${!n?.canUndo} title="Undo (⌘Z)">Undo</button>
          <button @click=${()=>this.redo()} ?disabled=${!n?.canRedo} title="Redo (⇧⌘Z)">Redo</button>
        </div>
        <span class="spacer"></span>
        ${this.renderSendButton()}
        <label>Watch
          <select @change=${r=>{this.selectOwner(r.target.value)}}>
            ${this.owners.map(r=>u`<option value=${r.owner_watch_id} ?selected=${r.owner_watch_id===this.ownerId}>
              ${Mi(r)} (${r.complication_count})</option>`)}
          </select>
        </label>
        <button class="primary save ${i?"dirty":""}" @click=${()=>{this.save()}} ?disabled=${!this.canEdit||!i||this.saving||!this.slotChosen} title="Save (⌘S)">${this.saving?"Saving\u2026":n?.baseRevision===null?"Save new":i?"Save":"Saved"}</button>
      </header>
      ${this.loadError?u`<div class="card error">${this.loadError}</div>`:m}
      ${this.watchSupported?u`<div class="layout cols-${a.columns}"
              style="--wa-left:${a.left}px;--wa-right:${a.right}px">
            <div class="column left">${this.renderAddLayer()}${this.renderLayers()}</div>
            ${this.renderGutter("left")}
            <div class="column canvas">${this.renderBanners()}${this.renderCanvas()}</div>
            ${this.renderGutter("right")}
            <div class="column inspector card">${this.renderInspector()}</div>
          </div>
          ${this.renderFooter()}`:u`<div class="card">
            <div class="banner warn"><b>Update the watch app first.</b> ${ir(this.selectedOwner?.app_version)}</div>
            <div class="hint">Nothing on this watch is changed or lost. Its ${this.selectedOwner?.complication_count??0} complication${this.selectedOwner?.complication_count===1?"":"s"} stay in Home Assistant and can be edited once the watch is updated.</div>
          </div>`}`}pickerRows(){return[...this.records.map(i=>({slot:Number(i.document?.slotIndex??0),kind:"record",record:i})),...this.occupied.map(i=>i.kind==="custom"?{slot:i.slot,kind:"locked",name:i.name||"Unnamed complication",badge:i.home||"Other home",title:`A complication on ${i.home?`the ${i.home} home`:"another home"}${i.families?.length?` (${i.families.map(O).join(", ")})`:""}. Edit it in that home's Wrist Assistant panel.`,families:i.families??[]}:{slot:i.slot,kind:"locked",name:i.name||"Unnamed preset",badge:"iPhone",title:"An iPhone preset complication. Edit it in the Wrist Assistant app on the iPhone.",families:[]})].sort((i,a)=>i.slot-a.slot)}shapeDots(n){return u`<span class="shape-dots">${at.map(i=>u`<span class="shape-dot ${i} ${n.includes(i)?"on":""}" title=${O(i)}></span>`)}</span>`}renderPicker(){let n=this.draft,i=this.records.find(s=>s.id===this.selectedId),a=n?n.config.name.trim()||"Untitled":"No complication",r=n?n.config.supportedFamilies:[],o=this.pickerRows(),l=this.freeSlot();return u`<div class="picker">
      <button aria-haspopup="listbox" aria-expanded=${this.pickerOpen?"true":"false"} title="Choose a complication"
        @click=${()=>this.togglePicker()}>
        ${this.shapeDots(r)}
        <span class="pk-name">${a}</span>
        ${i?u`<span class="pk-rev">r${i.revision}</span>`:n&&n.baseRevision===null?u`<span class="pk-rev">unsaved</span>`:m}
        ${z("chevron")}
      </button>
      ${this.pickerOpen?u`<div class="menu" role="listbox">
        ${o.length===0&&!(n&&n.baseRevision===null)?u`<div class="empty">No complications for this watch yet.</div>`:m}
        ${o.map(s=>s.kind==="record"?u`<button class="row" role="option" aria-current=${s.record.id===this.selectedId?"true":"false"}
              @click=${()=>{this.togglePicker(!1),this.selectRecord(s.record)}}>
              ${this.shapeDots(xd(s.record))}
              <span class="pk-name">${String(s.record.document?.name??"Untitled")}</span>
              <span class="pk-badge">r${s.record.revision}</span>
            </button>`:u`<div class="row locked" title=${s.title}>
              ${this.shapeDots(s.families)}
              <span class="pk-name">${s.name}</span>
              <span class="pk-badge">${s.badge}</span>
            </div>`)}
        ${n&&n.baseRevision===null?u`<div class="row" aria-current="true">${this.shapeDots(r)}<span class="pk-name">${a}</span><span class="pk-badge">unsaved</span></div>`:m}
        ${this.hass.user?.is_admin?u`
          <button class="row new" ?disabled=${l<0} @click=${()=>{this.newShapeChooser=!this.newShapeChooser}}>
            ${z("plus")}<span class="pk-name">New complication</span>${l<0?u`<span class="pk-badge">watch is full</span>`:m}
          </button>
          ${this.newShapeChooser&&l>=0?u`<div class="new-shape">
            <div class="hint">Start with one shape. More can be added under the preview later.</div>
            <div class="adders">
              ${at.map(s=>u`<button class="small ${s==="rectangular"?"primary":""}" @click=${()=>{this.togglePicker(!1),this.createNew(s)}}>${O(s)}</button>`)}
            </div>
          </div>`:m}`:m}
      </div>`:m}
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
                ${i.map(a=>u`<option value=${a.owner_watch_id} ?selected=${a.owner_watch_id===this.moveTarget}>${Mi(a)}</option>`)}
              </select>
              <button class="small" ?disabled=${!this.moveTarget||this.moving} @click=${()=>{this.moveAll()}}>${this.moving?"Moving\u2026":"Move"}</button>
            </div>`:u`<div class="hint">Only a Home Assistant administrator can move them.</div>`}
      ${this.moveError?u`<div class="err">${this.moveError}</div>`:m}
    </div>`}renderAddLayer(){let n=this.draft?.config;if(!n||!this.canEdit)return m;let i=n.elements.length>=64;return u`<div class="card">
      <h2 class="panel-title"><span class="swatch">${z("plus")}</span>Add a layer</h2>
      <div class="add-grid">
        ${er.map(a=>u`<button class="add" style=${`--k:${Q[a]}`} ?disabled=${i} title=${`Add a blank ${ot[a].toLowerCase()} layer`}
          @click=${()=>{let r=Ct(a);this.mutate(o=>{o.elements.push(r)}),this.inspect={kind:"layer",id:r.payload.id}}}>${z(a)}<span>${ot[a]}</span></button>`)}
      </div>
      <div class="presets-l">Or start from a preset</div>
      <div class="presets">
        ${yn.map(a=>u`<button class="preset" title=${a.blurb}
          ?disabled=${n.elements.length+a.layerCount>64}
          @click=${()=>this.openPreset(a.kind)}>${a.title}</button>`)}
      </div>
      ${this.renderPresetDialog()}
    </div>`}isGroupId(n){return this.draft?.config.groups?.some(i=>i.id===n)===!0}reorderLayer(n,i,a,r=!1){n!==i&&this.mutate(o=>{let l=o.elements.filter(g=>!se(o,g)),s=o.elements.filter(g=>se(o,g)),d=[...l].reverse(),c=d.find(g=>g.payload.id===i);if(!c)return;let p=o.groups?.find(g=>g.id===n),h=p?d.filter(g=>g.payload.groupId===p.id):d.filter(g=>g.payload.id===n);if(h.length===0||h.includes(c))return;d=d.filter(g=>!h.includes(g));let y;if((p||r)&&c.payload.groupId!==void 0){let g=d.filter(x=>x.payload.groupId===c.payload.groupId);y=a?d.indexOf(g[0]):d.indexOf(g[g.length-1])+1}else y=d.indexOf(c)+(a?0:1);if(d.splice(y,0,...h),!p){let g=h[0],x=r?void 0:c.payload.groupId;x===void 0?delete g.payload.groupId:g.payload.groupId=x}o.elements=[...d.reverse(),...s],ze(o),kt(o)})}rowDrag(n,i){return{draggable:i?"true":"false",onStart:a=>{this.dragId=n,a.dataTransfer?.setData("text/plain",n),a.dataTransfer&&(a.dataTransfer.effectAllowed="move"),a.currentTarget.classList.add("dragging")},onEnd:a=>{this.dragId=void 0,a.currentTarget.classList.remove("dragging")},onOver:a=>{if(!this.dragId||this.dragId===n)return;a.preventDefault();let r=a.currentTarget,o=r.getBoundingClientRect(),l=a.clientY<o.top+o.height/2;r.classList.toggle("drop-before",l),r.classList.toggle("drop-after",!l)},onLeave:a=>{a.currentTarget.classList.remove("drop-before","drop-after")},onDrop:a=>{a.preventDefault();let r=a.currentTarget,o=r.classList.contains("drop-before");r.classList.remove("drop-before","drop-after"),this.dragId&&this.reorderLayer(this.dragId,n,o),this.dragId=void 0}}}clickRow(n,i){if(i.shiftKey&&!i.metaKey&&!i.ctrlKey){this.pickRange(n);return}if(wo(i)){this.togglePick(n),this.pickAnchor=n;return}this.multi=new Set,this.inspect={kind:"layer",id:n},this.pickAnchor=n}pickRange(n){let i=this.draft?.config,a=this.pickAnchor??(this.inspect.kind==="layer"?this.inspect.id:void 0);if(!i||a===void 0||a===n){this.togglePick(n);return}let r=[...i.elements].filter(s=>!se(i,s)).reverse().map(s=>s.payload.id),o=r.indexOf(a),l=r.indexOf(n);if(o<0||l<0){this.togglePick(n);return}this.multi=new Set(r.slice(Math.min(o,l),Math.max(o,l)+1))}togglePick(n){let i=new Set(this.multi);i.size===0&&this.inspect.kind==="layer"&&this.inspect.id!==n&&i.add(this.inspect.id),i.has(n)?i.delete(n):i.add(n),this.multi=i}groupPicked(){let n=[...this.multi],i;this.mutate(a=>{i=va(a,n)}),this.multi=new Set,i&&(this.inspect={kind:"group",id:i})}renderLayers(){let n=this.draft?.config;if(!n)return m;let i=this.canEdit,a=this.canvasFamily,r=(b,F)=>this.mutate(M=>{let P=M.elements.filter(_=>!se(M,_)),C=M.elements.filter(_=>se(M,_)),I=P.findIndex(_=>_.payload.id===b),H=I+F;if(I<0||H<0||H>=P.length)return;[P[I],P[H]]=[P[H],P[I]];let D=P[H],Y=P[I];D.payload.groupId!==Y.payload.groupId&&(Y.payload.groupId===void 0?delete D.payload.groupId:D.payload.groupId=Y.payload.groupId),M.elements=[...P,...C],ze(M),kt(M)}),o=b=>{let F;this.mutate(M=>{F=Ta(M,b)}),F&&(this.inspect={kind:"layer",id:F})},l=b=>{this.mutate(F=>Ea(F,b)),this.inspect.kind==="layer"&&this.inspect.id===b&&(this.inspect={kind:"general"})},s=[...n.elements].filter(b=>!se(n,b)).reverse(),d=ce(this.host()),c=new Fe(this.buildContext()),p=n.perFamily[this.activeFamily],h=this.inspect.kind==="family",y=this.activeFamily==="inline"?"one line of text":`${p?.backgroundColorHex?be(p.backgroundColorHex):"transparent"} \xB7 ${p?.borderColorHex?`${p.borderWidth} pt border`:"no border"}`,g=[...this.multi].filter(b=>n.elements.some(F=>F.payload.id===b)).length,x=ei(n,this.buildContext(),this.forced)[a],w=b=>x?u`<span class="thumb">${qa(x,b,{icons:this.icons,imageSizes:this.imageSizes,width:Ii,height:vo})}</span>`:u`<span class="thumb"></span>`,T=(b,F)=>{let M=b.payload.id,P=this.inspect.kind==="layer"&&this.inspect.id===M,C=me(n,a,b),I=b.payload.isHidden||C.isHidden,H=ye(n,M)[0],D=It(b.payload.rules),Y=this.picking&&this.pickHoverId===M,_=this.rowDrag(M,i);return u`<div class="layer ${P?"hl":""} ${Y?"pick":""} ${I?"dim":""} ${this.multi.has(M)?"multi":""} ${F?"kid":""}"
        style=${`--k:${Q[b.kind]}`} tabindex="0" draggable=${_.draggable}
        @click=${N=>this.clickRow(M,N)}
        @keydown=${N=>{N.key==="Enter"&&(this.inspect={kind:"layer",id:M})}}
        @dragstart=${_.onStart} @dragend=${_.onEnd} @dragover=${_.onOver} @dragleave=${_.onLeave} @drop=${_.onDrop}>
        <span class="grip" title="Drag to reorder. Drop on a folder to put it inside.">${z("grip")}</span>
        <span class="bar"></span>
        ${w([M])}
        <span class="name">
          <b>${He(b,d)}</b>
          <small><span class="kind">${ot[b.kind]}</span> · ${Ed(b,c)}</small>
        </span>
        <span class="right">
          <span class="badges">
            ${H?u`<span class="badge tap" title=${`Tappable \xB7 ${He(H,d)}`}>tap</span>`:m}
            ${b.payload.rules.length===0?m:u`<span class="badge states" title=${D}>${D.replace(/\.$/,"").toLowerCase()}</span>`}
            ${I?u`<span class="badge">hidden</span>`:m}
          </span>
          ${i?u`<span class="acts">
            <button class="icon" title="Bring forward" aria-label="Bring forward" @click=${N=>{N.stopPropagation(),r(M,1)}}>${z("up")}</button>
            <button class="icon" title="Send back" aria-label="Send back" @click=${N=>{N.stopPropagation(),r(M,-1)}}>${z("down")}</button>
            <button class="icon" title=${C.isHidden?`Show in ${O(a)}`:`Hide in ${O(a)}`} aria-label=${C.isHidden?"Show this layer":"Hide this layer"} @click=${N=>{N.stopPropagation(),this.mutate(te=>pe(te,a,M,{isHidden:!C.isHidden}))}}>${z(C.isHidden?"hide":"show")}</button>
            <button class="icon" title="Duplicate" aria-label="Duplicate" @click=${N=>{N.stopPropagation(),o(M)}}>${z("duplicate")}</button>
            <button class="icon danger" title="Delete" aria-label="Delete" @click=${N=>{N.stopPropagation(),l(M)}}>${z("delete")}</button>
          </span>`:m}
        </span>
      </div>`},$=(b,F)=>{let M=this.inspect.kind==="group"&&this.inspect.id===b.id,P=!this.collapsed.has(b.id),C=this.rowDrag(b.id,i),I=F[0],H=F[F.length-1],D=["drop-before","drop-into","drop-after"],Y=_=>{let N=_.currentTarget.getBoundingClientRect(),te=(_.clientY-N.top)/N.height;return te<.25?"drop-before":!P&&te>.75?"drop-after":"drop-into"};return u`<div class="layer group ${M?"hl":""}" style=${`--k:${U.group}`} tabindex="0" draggable=${C.draggable}
        @click=${()=>{this.multi=new Set,this.inspect={kind:"group",id:b.id}}}
        @keydown=${_=>{_.key==="Enter"&&(this.inspect={kind:"group",id:b.id})}}
        @dragstart=${C.onStart} @dragend=${C.onEnd}
        @dragover=${_=>{if(!this.dragId||this.dragId===b.id)return;_.preventDefault();let N=_.currentTarget,te=Y(_);for(let fe of D)N.classList.toggle(fe,fe===te)}}
        @dragleave=${_=>{_.currentTarget.classList.remove(...D)}}
        @drop=${_=>{_.preventDefault();let N=_.currentTarget,te=Y(_);N.classList.remove(...D);let fe=this.dragId;if(this.dragId=void 0,!(!fe||!I||!H)){if(te==="drop-before"){this.reorderLayer(fe,I.payload.id,!0,!0);return}if(te==="drop-after"){this.reorderLayer(fe,H.payload.id,!1,!0);return}this.isGroupId(fe)||(this.reorderLayer(fe,I.payload.id,!0),this.mutate(ko=>ba(ko,fe,b.id)))}}}>
        <button class="chev" aria-expanded=${P?"true":"false"} title=${P?"Fold the group":"Unfold the group"}
          @click=${_=>{_.stopPropagation();let N=new Set(this.collapsed);P?N.add(b.id):N.delete(b.id),this.collapsed=N}}>${z("chevron")}</button>
        <span class="bar"></span>
        ${w(F.map(_=>_.payload.id))}
        <span class="name">
          <b>${b.name}</b>
          <small><span class="kind">Group</span> · ${F.length} layer${F.length===1?"":"s"} · ${b.locked?"moves as one":"unlocked"}</small>
        </span>
        <span class="right">
          ${i?u`<span class="acts">
            <button class="icon" title="Ungroup: keep the layers, drop the folder" aria-label="Ungroup" @click=${_=>{_.stopPropagation(),this.mutate(N=>Kt(N,b.id)),M&&(this.inspect={kind:"general"})}}>${z("ungroup")}</button>
          </span>`:m}
          <button class="icon lockbtn ${b.locked?"on":""}" ?disabled=${!i}
            title=${b.locked?"Locked: drags on the watch move the whole group. Click to unlock.":"Unlocked: each layer moves alone. Click to lock."}
            aria-label=${b.locked?"Unlock the group":"Lock the group"}
            @click=${_=>{_.stopPropagation(),this.mutate(N=>{let te=N.groups?.find(fe=>fe.id===b.id);te&&(te.locked=!te.locked)})}}>${z(b.locked?"lock":"unlock")}</button>
        </span>
      </div>`},f=[],v=new Set;for(let b=0;b<s.length;b++){let F=s[b],M=F.payload.groupId,P=M===void 0?void 0:n.groups?.find(I=>I.id===M);if(!P){f.push(T(F,!1));continue}if(v.has(P.id))continue;v.add(P.id);let C=s.filter(I=>I.payload.groupId===P.id);f.push($(P,C)),this.collapsed.has(P.id)||f.push(u`<div class="group-kids">${C.map(I=>T(I,!0))}</div>`)}return u`<div class="card">
      <h2 class="panel-title"><span class="swatch">${z("layers")}</span>Layers<span class="spacer"></span><span class="mini">top draws last</span>${this.renderPickButton()}</h2>
      ${this.activeFamily==="inline"?u`<div class="hint">Inline is one line of text and draws no layers. The rows here belong to the ${O(a)} shape.</div>`:m}
      ${g>=2&&i?u`<div class="group-cta"><span>${g} layers picked</span><span class="spacer"></span>
            <button class="small primary" @click=${()=>this.groupPicked()}>Group them</button>
            <button class="small" @click=${()=>{this.multi=new Set}}>Clear</button></div>`:n.elements.length>=2&&i&&!n.groups?.length?u`<div class="hint">${xo}-click layers here or on the preview, or shift-click a range of rows, then group them so a finished part moves as one.</div>`:m}
      ${n.elements.length===0?u`<div class="empty">No layers yet. Add one above.</div>`:m}
      <div class="layers">
      ${f}
      <div class="layer pinned ${h?"hl":""}" style=${`--k:${U.place}`} tabindex="0" title="The shape is always the bottom layer"
        @click=${()=>{this.inspect={kind:"family"}}}
        @keydown=${b=>{b.key==="Enter"&&(this.inspect={kind:"family"})}}
        @dragover=${b=>{this.dragId&&(b.preventDefault(),b.currentTarget.classList.add("drop-before"))}}
        @dragleave=${b=>{b.currentTarget.classList.remove("drop-before")}}
        @drop=${b=>{b.preventDefault(),b.currentTarget.classList.remove("drop-before");let F=this.dragId,M=[...s].reverse().find(P=>P.payload.id!==F&&P.payload.groupId!==F);F&&M&&this.reorderLayer(F,M.payload.id,!1,!0),this.dragId=void 0}}>
        <span class="grip">${z("shape")}</span>
        <span class="bar"></span>
        ${w([])}
        <span class="name">
          <b>${this.activeFamily==="inline"?"Inline text":`${O(this.activeFamily)} shape`}</b>
          <small><span class="kind">${this.activeFamily==="inline"?"Inline":"Background"}</span> · ${y}</small>
        </span>
        <span class="right"><span class="badges"><span class="badge">always bottom</span></span></span>
      </div>
      </div>
    </div>`}renderPresetDialog(){let n=this.presetKind?uo(this.presetKind):void 0,i=this.presetEntity;return u`<dialog class="preset-dialog" @keydown=${this.presetKeys}
        @close=${()=>{this.presetKind=void 0,this.presetEntity=void 0}}>
      ${n===void 0?m:u`
        <h2>${n.title}</h2>
        <div class="hint">${n.blurb}</div>
        ${_e(this.host(),"Entity",i??{entityId:"",displayName:"",domain:""},a=>{this.presetEntity=a.entityId===""?void 0:a},fo,{compact:!0,...n.domains?{domain:n.domains}:{},...n.preferNumeric?{preferNumeric:!0}:{}})}
        <div class="adders">
          <button class="primary" ?disabled=${i===void 0} @click=${()=>this.createFromPreset()}>Create</button>
          <button class="small" @click=${()=>this.closePresetDialog()}>Cancel</button>
        </div>
        <div class="hint">Escape creates nothing, and Undo removes a whole preset in one step.</div>`}
    </dialog>`}openPreset(n){this.canEdit&&(this.presetKind=n,this.presetEntity=void 0,this.updateComplete.then(()=>{let i=this.renderRoot.querySelector("dialog.preset-dialog");i&&(i.open||i.showModal(),i.querySelector(".entity-field input")?.focus())}))}closePresetDialog(){let n=this.renderRoot.querySelector("dialog.preset-dialog");n?.open?n.close():(this.presetKind=void 0,this.presetEntity=void 0)}createFromPreset(){let n=this.presetKind,i=this.presetEntity;if(!n||!i)return;let a={family:this.canvasFamily},r=this.hass.states[i.entityId];r&&(a.state=r);let o;this.mutate(l=>{o=mo(l,n,i,a)}),this.closePresetDialog(),o&&(this.inspect={kind:"layer",id:o})}renderCanvas(){if(this.parseError)return u`<div class="card error">This document cannot be read: ${this.parseError}</div>`;let n=this.draft?.config;if(!n)return u`<div class="card"><div class="empty">Choose a complication in the picker above, or make a new one.</div></div>`;let i=ei(n,this.buildContext(),this.forced);this.syncCountdownTicker(i);let a=this.currentCase(),r=this.activeFamily;return u`<div class="card canvas-card">
      <div class="canvas-bar">
        <label>Preview as
          <select @change=${o=>{this.previewCase=o.target.value}}>
            ${Tt.map(o=>u`<option value=${o.label} ?selected=${o.label===a.label}>${o.label}${o.measured?"":" (estimated)"}</option>`)}
          </select>
        </label>
        <span class="hint">Layouts are made in the ${Ft.label} box. Smaller cases scale it down.</span>
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
    </div>`}renderBigPreview(n,i,a){let r=i[n];if(!r)return m;let o=this.inspect.kind==="layer"?this.inspect.id:void 0,l=this.draft?.config,s=this.inspect.kind==="group"?this.inspect.id:o!==void 0&&l?Ue(l,o)?.id:void 0,d=l&&s!==void 0&&(this.inspect.kind==="group"||Ue(l,o)?.locked)?Le(l,s).map(g=>g.payload.id):[],c=[...new Set([...d,...this.multi])],p=a.slots[n],h=this.focusTapId(),y={icons:this.icons,imageSizes:this.imageSizes,showHidden:!0,tapAreas:!0,slot:p,highlightId:h??o,...c.length>0&&!this.showTaps?{highlightIds:c}:{},tapReview:this.showTaps,...h!==void 0?{tapFocusId:h}:{},handles:this.canEdit&&!this.picking&&(!this.showTaps||h!==void 0),...this.picking&&this.pickHoverId!==void 0?{hoverId:this.pickHoverId}:{},...this.timestampActiveId!==void 0&&this.timestampActiveId===o&&!this.showTaps&&!this.picking?{timestampActiveId:this.timestampActiveId}:{}};return u`<div class="preview ${n} active ${this.picking?"picking":""}"
      @pointerdown=${g=>this.onPreviewPointerDown(n,g)}
      @pointermove=${g=>this.onPickMove(g)}
      @pointerleave=${()=>{this.picking&&(this.pickHoverId=void 0)}}>
      ${li(r,y)}
    </div>`}renderUnder(n,i){let a=ce(this.host()),r=this.inspect,o=r.kind==="layer"?n.elements.find(p=>p.payload.id===r.id):void 0,l;if(this.showTaps)l=u`Every tap area is outlined. Where two overlap, the one higher in Layers wins. Anywhere else does <b>${Te(n.tapAction)}</b>.`;else if(this.picking)l="Point at a layer and click it. Escape stops.";else if(i==="inline")l="One line of text. Edit it on the right.";else if(r.kind==="group"){let p=n.groups?.find(y=>y.id===r.id),h=p?Le(n,p.id).length:0;l=p?u`editing group <b>${p.name}</b>. ${p.locked?`Drag to move all ${h} layers.`:"Unlocked: each layer drags alone."}`:""}else if(o){let p=Ue(n,o.payload.id);l=p?.locked?u`editing <b>${He(o,a)}</b> in <b>${p.name}</b>. A drag moves the whole group; pull a corner to resize this layer. Arrow keys nudge the group.`:u`editing <b>${He(o,a)}</b>. Drag it, or pull a corner. Arrow keys nudge it.`}else l="click a layer to edit it";if(i==="inline")return u`<div class="under"><b>Inline</b> · ${l}</div>`;let s=this.currentCase().slots[i],d=Qt(s,i),c=Math.round(d.scale*100);return u`<div class="under"><b>${O(i)}</b> · ${s.width} × ${s.height} pt${c!==100?` \xB7 ${c}%`:""} · ${l}</div>`}renderInlinePreview(n,i){let a;if(!n)a=u`<div class="inline-line missing">No inline text</div>`;else{let r=Date.now(),o=n.countdownEnd!==void 0&&n.countdownEnd>r?it((n.countdownEnd-r)/1e3):n.text,l=n.symbol?this.icons.render(n.symbol,i?11:15,"#FFFFFF"):void 0;a=u`<div class="inline-line">${l??m}<span>${n.label?`${n.label}: `:""}${o}</span></div>`}return i?a:u`<div class="preview inline active" @click=${()=>{this.inspect={kind:"family"}}}>${a}</div>`}renderSettingsRow(n){let i=this.host(),a=this.records.find(c=>c.id===this.selectedId),r=this.selectedOwner,o=[a?`Revision ${a.revision}`:"Not saved yet",r?Mi(r):void 0].filter(Boolean).join(" \xB7 "),l=n.values,s=new Fe(this.buildContext()),d=ce(i);return u`<div class="strip-row" style=${`--c:${U.complication}`} @change=${()=>this.draft?.endGesture()}>
      <h2 class="panel-title"><span class="swatch">${z("watch")}</span>Complication<span class="spacer"></span><span class="mini">${o}</span>
        <button class="small" @click=${()=>this.openRaw()}>Raw JSON</button>
        ${this.canEdit?u`
          <button class="small" @click=${()=>this.duplicate()}>Duplicate</button>
          ${this.confirmDelete?u`<button class="danger small" @click=${()=>{this.deleteCurrent()}}>Really delete</button><button class="small" @click=${()=>{this.confirmDelete=!1}}>Cancel</button>`:u`<button class="danger small" @click=${()=>{this.confirmDelete=!0}}>Delete</button>`}`:m}
      </h2>
      <div class="settings" style=${this.canEdit?"":"pointer-events:none;opacity:.6"}>${Yr(i)}</div>
      <div class="values-list">
        <div class="values-head"><span class="sub">Shared values</span>
          ${this.canEdit?u`<button class="small" @click=${()=>{let c=Zr();this.mutate(p=>{p.values.push(c)}),this.inspect={kind:"data",id:c.id}}}>Add</button>`:m}
          <span class="help" title="A value defined once and read by several layers. Set a layer's Source to &quot;Named value&quot; to use one.">Defined once, read by several layers.</span>
        </div>
        ${l.length===0?u`<p class="empty">No shared values yet.</p>`:u`<div class="data">
        ${l.map(c=>{let p=s.resolve({kind:{kind:"named",id:c.id}}),h=this.inspect.kind==="data"&&this.inspect.id===c.id;return u`<div class="datum ${h?"hl":""}" @click=${()=>{this.inspect={kind:"data",id:c.id}}}>
            <span class="name">${c.name||"(unnamed)"}</span>
            <span class="meta ${p===void 0?"none":""}" title=${de(c.value,d)}>${p??"unresolved"}</span>
            ${this.canEdit?u`<button class="icon danger" title="Delete value" aria-label="Delete value" @click=${y=>{y.stopPropagation(),this.mutate(g=>{g.values=g.values.filter(x=>x.id!==c.id)}),h&&(this.inspect={kind:"general"})}}>${z("delete")}</button>`:m}
          </div>`})}
        </div>`}
      </div>
    </div>`}openRaw(){this.showRaw=!0;let n=this.renderRoot.querySelector("details.foot");n&&(n.open=!0),this.updateComplete.then(()=>this.renderRoot.querySelector("pre")?.scrollIntoView({block:"nearest"}))}renderShapesRow(n,i){let a=n.supportedFamilies;return u`<div class="strip-row">
      <h2 class="panel-title" style=${`--c:${U.place}`}><span class="swatch">${z("shape")}</span>Shapes</h2>
      <div class="tiles">
        ${at.map(r=>{if(!a.includes(r))return u`<button class="tile off ${r}" ?disabled=${!this.canEdit} title=${`Add the ${O(r)} shape`} @click=${()=>this.addShape(r)}>
              <span class="art"><span class="ghost ${r}"></span></span>
              <span class="lbl">+ Add ${O(r)}</span>
            </button>`;let l=r===this.activeFamily,s;if(r==="inline")s=this.renderInlinePreview(i.inline,!0);else{let p=i[r];s=p?li(p,{icons:this.icons,imageSizes:this.imageSizes,slot:Ft.slots[r]}):m}let d=r!=="inline"&&n.elements.every(p=>me(n,r,p).isHidden||p.payload.isHidden)&&n.elements.length>0,c=this.canEdit&&rt(n,r);return u`<div class="tile-wrap">
            <button class="tile ${r}" aria-pressed=${l?"true":"false"} title=${`Edit the ${O(r)} shape`}
              @click=${()=>{this.activeFamily=r,r==="inline"&&this.inspect.kind==="layer"&&(this.inspect={kind:"family"})}}>
              <span class="art">${s}</span>
              <span class="lbl">${O(r)}${d?u`<small>· nothing shown</small>`:m}${l?u`<small>· editing</small>`:m}</span>
            </button>
            ${this.canEdit?u`<button class="icon danger tile-x" ?disabled=${!c}
              title=${c?`Remove the ${O(r)} shape`:"The only shape. Add another before removing it."}
              aria-label=${`Remove the ${O(r)} shape`}
              @click=${p=>{p.stopPropagation(),this.removeShape(r)}}>${z("delete")}</button>`:m}
          </div>`})}
      </div>
      <div class="help">Click a shape to edit it in the big preview. Each shape keeps its own placements. Each shape adds an entry to the watch face picker. If you do not need a shape, delete it with the trash can on its card.</div>
    </div>`}renderValuesRow(){let n=this.draft?.config;if(!n)return m;let i=[...this.compiled?.entities.keys()??[]],a=this.testValues.size>0;return u`<div class="strip-row">
      <h2 class="panel-title" style=${`--c:${U.states}`}><span class="swatch">${z("states")}</span>Values on the watch<span class="spacer"></span>
        ${a?u`<span class="testing-pill">Testing with your values <button @click=${()=>{this.testValues=new Map,this.editingValue=void 0}}>Back to live</button></span>`:m}
      </h2>
      ${i.length===0?u`<div class="hint">No entities yet. Give a layer an entity and its live value shows here.</div>`:u`<div class="chips values">
        ${i.map(r=>{let o=this.hass.states[r],l=typeof o?.attributes.friendly_name=="string"?o.attributes.friendly_name:r,s=typeof o?.attributes.unit_of_measurement=="string"?` ${o.attributes.unit_of_measurement}`:"",d=o?`${o.state}${s}`:"not in Home Assistant",c=this.testValues.get(r),h=n.elements.find(g=>qt(n,g.payload.id).some(x=>x.ref.entityId===r))?.kind??"text",y=this.editingValue===r;return u`<button class="vchip ${c!==void 0?"testing":""}" style=${`--k:${Q[h]}`}
            title=${c!==void 0?`Live value: ${d}. Click to change the test value.`:"Click to try a different value"}
            @click=${g=>{g.target.tagName!=="INPUT"&&(this.editingValue=r,this.updateComplete.then(()=>this.renderRoot.querySelector(".vchip input")?.focus()))}}>
            <span class="dom">${z(h)}</span><b>${l}</b>
            ${y?u`<input type="text" .value=${c??o?.state??""} aria-label=${`Test value for ${l}`}
                  @keydown=${g=>{g.key==="Enter"&&g.target.blur(),g.key==="Escape"&&(this.editingValue=void 0)}}
                  @blur=${g=>this.commitTestValue(r,g.target.value)} />`:u`<span class="val">${c!==void 0?`${c}${s}`:d}</span>`}
          </button>`})}
      </div>
      <div class="help">Live from Home Assistant. Click a value to try a different one and watch the states react. Nothing is saved.</div>`}
    </div>`}commitTestValue(n,i){this.editingValue=void 0;let a=i.trim(),r=new Map(this.testValues),o=this.hass.states[n]?.state;a===""||a===o?r.delete(n):r.set(n,a),this.testValues=r}currentCase(){return Tt.find(n=>n.label===this.previewCase)??Ft}previewSlot(n){return this.currentCase().slots[n]}crumbs(n,i){let a=this.inspect,r=n.name.trim()||"Complication",o=this.activeFamily==="inline"?"Inline":O(this.activeFamily),l=a.kind==="family"&&i===void 0?u`<span class="here" style=${`--k:${U.place}`}>${o} shape</span>`:u`<button @click=${()=>{this.inspect={kind:"family"}}} title="Edit the shape">${o}</button>`,s=m,d=m;if(i!==void 0)s=u`<span class="here" style="--k:var(--wa-accent)"><span class="kchip">Picked</span>${i} layers</span>`;else if(a.kind==="layer"){let c=n.elements.find(p=>p.payload.id===a.id);if(c){s=u`<span class="here" style=${`--k:${Q[c.kind]}`}><span class="kchip">${ot[c.kind]}</span>${He(c,ce(this.host()))}</span>`;let p=Ue(n,c.payload.id);p&&(d=u`<span class="sep">›</span><button @click=${()=>{this.inspect={kind:"group",id:p.id}}} title="Edit the group">${p.name}</button>`)}}else if(a.kind==="group"){let c=n.groups?.find(p=>p.id===a.id);c&&(s=u`<span class="here" style=${`--k:${U.group}`}><span class="kchip">Group</span>${c.name}</span>`)}else if(a.kind==="data"){let c=n.values.find(p=>p.id===a.id);c&&(s=u`<span class="here" style=${`--k:${U.complication}`}><span class="kchip">Value</span>${c.name||"(unnamed)"}</span>`)}else a.kind==="general"&&(s=u`<span class="mini">nothing selected</span>`);return u`<div class="crumbs">
      <span>${r}</span><span class="sep">›</span>${l}${d}
      ${s===m?m:u`<span class="sep">›</span>${s}`}
    </div>`}pickedElements(n){return this.multi.size<2?[]:n.elements.filter(i=>this.multi.has(i.payload.id))}renderInspector(){let n=this.draft?.config;if(!n)return m;let i=this.pickedElements(n);if(i.length>=2)return u`
        <div class="insp-head">${this.crumbs(n,i.length)}</div>
        <div class="insp-body" style=${this.canEdit?"":"pointer-events:none;opacity:.6"}
          @change=${()=>this.draft?.endGesture()}>${this.multiEditor(n,i)}</div>`;let a=this.host(),r=this.inspect,o=m,l=!0;if(r.kind==="layer"){let d=n.elements.find(c=>c.payload.id===r.id);if(!d)return this.inspect={kind:"general"},m;o=eo(a,d,this.canvasFamily)}else if(r.kind==="group"){let d=n.groups?.find(c=>c.id===r.id);if(!d)return this.inspect={kind:"general"},m;l=!1,o=no(a,d)}else if(r.kind==="data"){let d=n.values.find(c=>c.id===r.id);if(!d)return this.inspect={kind:"general"},m;l=!1,o=u`<div class="sec" data-open="true" style=${`--c:${U.complication}`}>
        <div class="sec-h"><span class="swatch">${z("content")}</span><span class="tt"><h4>Shared value</h4><span class="sum">Read by layers whose Source is "Named value"</span></span></div>
        <div class="sec-b">${Xr(a,d)}</div>
      </div>`}else r.kind==="family"?o=io(a,this.activeFamily):(l=!1,o=u`<div class="empty-insp">${z("layers")}<b>Nothing selected</b>
        <span>Click a layer on the watch or in the list to edit it.<br />The shape's own background and border are the bottom row of the list.</span></div>`);let s=this.openSections.size>1;return u`
      <div class="insp-head">
        ${this.crumbs(n)}
        ${l?u`<button class="expand" @click=${()=>{this.openSections=s?new Set([wd(r)]):new Set(xi)}}>${s?"One at a time":"Open all"}</button>`:m}
      </div>
      <div class="insp-body" style=${this.canEdit?"":"pointer-events:none;opacity:.6"} @change=${()=>this.draft?.endGesture()}>${o}</div>`}triCheck(n,i,a){return u`<label class="field check">
      <input type="checkbox" .checked=${i==="all"} .indeterminate=${i==="mixed"}
        @change=${r=>a(r.target.checked)} />
      <span>${n}${i==="mixed"?u` <span class="mixed">(mixed)</span>`:m}</span></label>`}multiEditor(n,i){let a=this.canvasFamily,r=ce(this.host()),o=new Fe(this.buildContext()),l=Qr(n,a,i),s=i.length,d=[...i].reverse(),c=y=>this.mutate(g=>{for(let x of i)pe(g,a,x.payload.id,{isHidden:y})}),p=y=>this.mutate(g=>{for(let x of i){let w=g.elements.find(T=>T.payload.id===x.payload.id);w&&(w.payload.isHidden=y)}}),h=y=>this.mutate(g=>{for(let x of i){let w=g.elements.find(T=>T.payload.id===x.payload.id);w&&w.kind!=="image"&&w.kind!=="tap"&&(w.payload.colorSlot.baseColorHex=y)}},"multi-colour");return u`
      <div class="sec" data-open="true" style="--c:var(--wa-accent)">
        <div class="sec-h"><span class="swatch">${z("layers")}</span>
          <span class="tt"><h4>${s} layers picked</h4><span class="sum">Edits here land on all ${s}</span></span></div>
        <div class="sec-b">
          <div class="picked">
            ${d.map(y=>u`<div class="row" style=${`--k:${Q[y.kind]}`}>
              <span class="bar"></span>
              <span class="name">
                ${y.kind==="icon"?u`<span class="glyph">${this.icons.render(o.resolve(y.payload.symbol)??"questionmark",16,y.payload.colorSlot.baseColorHex)??m}</span>`:m}
                <b>${He(y,r)}</b><span class="kind">${ot[y.kind]}</span>
              </span>
            </div>`)}
          </div>
          <div class="hint">${xo}-click a layer to add it or take it out. Click one on its own to edit it alone.</div>
          <div class="adders">
            <button class="small primary" @click=${()=>this.groupPicked()}>Group them</button>
            <button class="small" @click=${()=>{this.multi=new Set}}>Clear</button>
          </div>
        </div>
      </div>
      <div class="sec" data-open="true" style=${`--c:${U.place}`}>
        <div class="sec-h"><span class="swatch">${z("place")}</span>
          <span class="tt"><h4>All ${s} at once</h4><span class="sum">The settings every picked layer has</span></span></div>
        <div class="sec-b">
          ${this.triCheck(`Hidden in ${O(a)}`,l.hiddenHere,c)}
          ${this.triCheck("Hidden in every shape",l.hiddenEverywhere,p)}
          ${l.colourable?u`${he("Colour",l.colour,y=>{y!==void 0&&h(y)})}
              ${l.colour===void 0?u`<div class="hint">These layers are different colours. Pick one to give them all the same.</div>`:m}`:u`<div class="hint">No shared colour: a picture and a tap area have none.</div>`}
          <div class="hint">Size, content and states belong to one layer at a time. Click a layer on its own to reach them.</div>
        </div>
      </div>`}renderFooter(){let n=this.draft;if(!n)return m;let i=this.records.find(r=>r.id===this.selectedId),a=lr({revision:i?.revision??null,dirty:n.dirty,...this.saveError!==void 0?{error:this.saveError}:{},...this.templateError!==void 0?{templateError:this.templateError}:{}});return u`<details class="foot">
      <summary>
        <span class="foot-dot ${a.tone}">●</span>
        <span class="foot-text">${a.text}</span>
        <span class="foot-more">Details and raw configuration</span>
      </summary>
      <div class="foot-body">
        <dl class="kv">
          <dt>Revision</dt><dd>${i?i.revision:"unsaved"}${n.dirty?u` <span class="warn">· unsaved changes</span>`:""}</dd>
          ${i?u`<dt>Saved</dt><dd>${i.updatedAt||"\u2014"} by ${i.updatedBy||"\u2014"}</dd>`:m}
          <dt>Templates</dt><dd class=${this.templateError?"err":"ok"}>${this.templateError??(this.compiled?.document?"rendered":"none")}</dd>
          <dt>Entities</dt><dd>${this.compiled?.entities.size??0}</dd>
        </dl>
        <p class="hint">Save writes to Home Assistant. Open Wrist Assistant on the watch to pull it down.</p>
        <button class="link" @click=${()=>this.showRaw=!this.showRaw}>${this.showRaw?"Hide the raw configuration":"Show the raw configuration"}</button>
        ${this.showRaw?u`<pre>${JSON.stringify(n.encoded(),null,2)}</pre>`:m}
      </div>
    </details>`}};A([et({attribute:!1})],R.prototype,"hass",2),A([et({type:Boolean})],R.prototype,"narrow",2),A([et({attribute:!1})],R.prototype,"panel",2),A([L()],R.prototype,"colLeft",2),A([L()],R.prototype,"colRight",2),A([L()],R.prototype,"panelWidth",2),A([L()],R.prototype,"owners",2),A([L()],R.prototype,"ownerId",2),A([L()],R.prototype,"records",2),A([L()],R.prototype,"selectedId",2),A([L()],R.prototype,"draft",2),A([L()],R.prototype,"readOnlyReason",2),A([L()],R.prototype,"parseError",2),A([L()],R.prototype,"maxSchemaVersion",2),A([L()],R.prototype,"presets",2),A([L()],R.prototype,"occupied",2),A([L()],R.prototype,"serverToken",2),A([L()],R.prototype,"appliedToken",2),A([L()],R.prototype,"polling",2),A([L()],R.prototype,"sendPending",2),A([L()],R.prototype,"pages",2),A([L()],R.prototype,"templateResults",2),A([L()],R.prototype,"templateError",2),A([L()],R.prototype,"templateFetchedAt",2),A([L()],R.prototype,"forced",2),A([L()],R.prototype,"showRaw",2),A([L()],R.prototype,"inspect",2),A([L()],R.prototype,"openSections",2),A([L()],R.prototype,"pickerOpen",2),A([L()],R.prototype,"testValues",2),A([L()],R.prototype,"editingValue",2),A([L()],R.prototype,"multi",2),A([L()],R.prototype,"collapsed",2),A([L()],R.prototype,"activeFamily",2),A([L()],R.prototype,"picking",2),A([L()],R.prototype,"pickHoverId",2),A([L()],R.prototype,"showTaps",2),A([L()],R.prototype,"timestampActiveId",2),A([L()],R.prototype,"savedName",2),A([L()],R.prototype,"presetKind",2),A([L()],R.prototype,"presetEntity",2),A([L()],R.prototype,"newShapeChooser",2),A([L()],R.prototype,"previewCase",2),A([L()],R.prototype,"loadError",2),A([L()],R.prototype,"saveError",2),A([L()],R.prototype,"saving",2),A([L()],R.prototype,"conflict",2),A([L()],R.prototype,"remoteRevision",2),A([L()],R.prototype,"confirmDelete",2),A([L()],R.prototype,"moveTarget",2),A([L()],R.prototype,"moving",2),A([L()],R.prototype,"moveError",2),A([L()],R.prototype,"version",2);function Pe(e){return String(e?.message??e)}function Sd(e){if(typeof e=="number"&&Number.isFinite(e))return e;if(typeof e!="string"||e==="")return;let t=e.split(":").map(n=>Number(n));if(!(t.length===0||t.length>3||t.some(n=>Number.isNaN(n))))return t.reduce((n,i)=>n*60+i,0)}function Mi(e){let t=e.device_name??e.owner_watch_id;return e.paired_iphone_name?`${t} (${e.paired_iphone_name})`:t}function Ed(e,t){switch(e.kind){case"text":return`${t.resolve(e.payload.value)??"--"} \xB7 ${e.payload.fontSize} pt`;case"icon":return`${e.payload.size} pt \xB7 ${be(e.payload.colorSlot.baseColorHex)}`;case"gauge":return`${t.resolve(e.payload.value)??"--"} \xB7 ${e.payload.style}`;case"shape":return`${be(e.payload.colorSlot.baseColorHex)}${e.payload.borderColorHex?" \xB7 border":""}`;case"image":return`${e.payload.contentMode==="fill"?"fill":"fit"} \xB7 ${e.payload.timestamp?"time shown":"no time"}`;case"tap":return Te(e.payload.action)}}customElements.get("wrist-assistant-panel")||customElements.define("wrist-assistant-panel",R);export{R as WristAssistantPanel,$o as columnFit};
