import{a as he,b as Vt,c as jt,d as qt,e as fe,f as Zt,g as Yt,h as Xt,i as en,j as tn,k as nn,l as on,m as an,n as sn,o as dn,p as cn,q as ln,r as pn,s as un}from"./chunk-EGSFIOMS.js";import{d as rn}from"./chunk-BOF3NRZW.js";import{c as st}from"./chunk-K2Z4YFL6.js";import{Ib as Gt,mb as Ft,yb as me}from"./chunk-XL6XW3CQ.js";import"./chunk-QJLAA45L.js";import{h as fn}from"./chunk-G3MOPAU6.js";import"./chunk-NKS3YFWZ.js";import"./chunk-VTJWFJNF.js";import{a as Bt,b as Wt}from"./chunk-NF2JSGU6.js";import{d as Ut,e as Qt,r as Kt}from"./chunk-UXZAH5YG.js";import"./chunk-UYTM6GVI.js";import"./chunk-ISXI4D33.js";import"./chunk-ORO4TUMU.js";import{d as Mt,e as It,g as Ct}from"./chunk-AKQNQBAU.js";import{A as Lt,Ab as ue,F as Nt,Fa as Jt,Ib as Z,tb as zt}from"./chunk-S3MXJPYQ.js";import{B as hn,z as mn}from"./chunk-ANVJKMPJ.js";import"./chunk-TOKIRHDQ.js";import"./chunk-2MQ2CMMA.js";import"./chunk-4ILUENBV.js";import{a as Ot,b as Ht,c as Pt}from"./chunk-6VFGEHQF.js";import"./chunk-XXHMYMU2.js";import{i as Tt}from"./chunk-PWVBP3GH.js";import{Ah as mt,Bg as P,Dg as ot,Gg as rt,Ig as it,Jg as at,b as S,c as w,cg as nt,ph as x,qh as dt,th as ct,vh as lt,xh as pt,zh as ut}from"./chunk-NPUC537M.js";import"./chunk-XYOM42CD.js";import"./chunk-RWBTFEBI.js";import"./chunk-TZSFC7IJ.js";import{h as $t,j as pe,k as M,m as I,n as q,o as Dt,p as _t}from"./chunk-BKWT47LT.js";import{Eb as At,Gb as Et,Hb as _,Ja as kt,La as St,R as ht,U as ft,Ua as Rt,aa as gt,ba as wt,fa as bt,ia as se,ka as vt,ma as de,oa as ce,pa as j,ra as yt,sa as le,za as xt}from"./chunk-NDCIP4JT.js";import"./chunk-JQATBWON.js";import{b as V,f as d,g as ae,i as m,l as tt}from"./chunk-6ZDBXU6B.js";import{a as f}from"./chunk-LO2NM3CE.js";var gn={version:1,note:"The panel's own table: edit it here. RoomRulesTableTests in the app repository checks the parts the watch decides against the watch's code.",keys:{sensor:"roomQuickJumpSourceEntityId",fallback:"roomQuickJumpFallbackPageId",mappings:"roomQuickJumpMappings",autoSwitch:"roomAutoSwitchEnabled",legacyQuickJump:"roomQuickJumpEnabled",zones:"pointControlRoomMappingsJSON",topSectionDoubleTap:"topSectionDoubleTapAction",handGesture:"handGestureAction",tapToToggle:"pointControlTapToToggle",liveTile:"pointControlLiveTile"},normalize:{rule:"Lower case; _ and - as spaces; anything but a-z, 0-9 and space as a space; runs of spaces as one, none at either end.",cases:[{input:"Living Room",key:"living room"},{input:"living_room",key:"living room"},{input:"Living-Room",key:"living room"},{input:"  Kitchen  ",key:"kitchen"},{input:"Kids' Room",key:"kids room"},{input:"ROOM__3",key:"room 3"},{input:"Room 2",key:"room 2"},{input:"Office/Study",key:"office study"},{input:"1st floor",key:"1st floor"},{input:"a	b",key:"a b"},{input:"Caf\xE9",key:"caf"},{input:"B\xFCro",key:"b ro"},{input:"\u0130stanbul",key:"i stanbul"},{input:"\u65E5\u672C",key:""},{input:"\uFF2C\uFF49\uFF56\uFF49\uFF4E\uFF47",key:""},{input:"",key:""},{input:"___",key:""},{input:"--",key:""},{input:"kitchen.",key:"kitchen"},{input:"Master Bedroom (Upstairs)",key:"master bedroom upstairs"}]},roomValue:{notRoom:["unknown","unavailable","none","null","on","off","true","false","home","not_home","away"],rule:"Trimmed, not empty, not one of notRoom (compared lower case), not a number as Swift's Double reads one (nan, inf, infinity and hex floats included), and with a letter in it.",source:"The watch reads a person's room from its state only. Any other sensor gives its state, or, when that is not a room, its location_name attribute.",attribute:"location_name",cases:[{input:"Kitchen",room:!0},{input:"living_room",room:!0},{input:"unknown",room:!1},{input:"Unavailable",room:!1},{input:" on ",room:!1},{input:"OFF",room:!1},{input:"home",room:!1},{input:"not_home",room:!1},{input:"Away",room:!1},{input:"none",room:!1},{input:"NULL",room:!1},{input:"true",room:!1},{input:"42",room:!1},{input:"3.5",room:!1},{input:"-1",room:!1},{input:"1e3",room:!1},{input:"1E3",room:!1},{input:"nan",room:!1},{input:"NaN",room:!1},{input:"inf",room:!1},{input:"-Infinity",room:!1},{input:"0x1F",room:!1},{input:"0x1p3",room:!1},{input:"+5",room:!1},{input:".5",room:!1},{input:"",room:!1},{input:"   ",room:!1},{input:"!!",room:!1},{input:"2nd floor",room:!0},{input:"B\xFCro",room:!0},{input:"\u65E5\u672C",room:!0},{input:"e",room:!0},{input:"Home Office",room:!0}]},switching:{keys:["roomQuickJumpSourceEntityId","roomQuickJumpEnabled","roomAutoSwitchEnabled","topSectionDoubleTapAction","handGestureAction"],triggers:[{value:"Automatic",label:"Automatic",help:"Switches when your room sensor detects a new room. Uses more battery."},{value:"Double-Tap Top",label:"Double-tap the page title",help:"Double-tap the page title or top area to switch."},{value:"Double Pinch",label:"Double Pinch",help:"Double pinch gesture to switch rooms"}],absent:{handGestureAction:"Refresh"},rule:"Picking a room sensor writes only roomQuickJumpSourceEntityId. Switch Pages by Room on is Double-Tap Top. When nothing is on, the trigger shown is Double-Tap Top.",cases:[{op:{switch:!0},before:{},after:{roomQuickJumpEnabled:!1,roomAutoSwitchEnabled:!1,topSectionDoubleTapAction:"Room Jump"}},{op:{switch:!0},before:{topSectionDoubleTapAction:"Room Jump"},after:{roomQuickJumpEnabled:!1,roomAutoSwitchEnabled:!1,topSectionDoubleTapAction:"Room Jump"}},{op:{switch:!0},before:{roomAutoSwitchEnabled:!1,handGestureAction:"Room Jump"},after:{roomQuickJumpEnabled:!1,roomAutoSwitchEnabled:!1,topSectionDoubleTapAction:"Room Jump",handGestureAction:"Refresh"}},{op:{switch:!0},before:{topSectionDoubleTapAction:"Activate Scene",handGestureAction:"Next Page"},after:{roomQuickJumpEnabled:!1,roomAutoSwitchEnabled:!1,topSectionDoubleTapAction:"Room Jump",handGestureAction:"Next Page"}},{op:{switch:!0},before:{roomQuickJumpEnabled:!0,topSectionDoubleTapAction:"Disabled"},after:{roomQuickJumpEnabled:!1,roomAutoSwitchEnabled:!1,topSectionDoubleTapAction:"Room Jump"}},{op:{switch:!0},before:{roomQuickJumpSourceEntityId:"sensor.watch_area",roomQuickJumpEnabled:!0,roomAutoSwitchEnabled:!0,topSectionDoubleTapAction:"Room Jump",handGestureAction:"Room Jump"},after:{roomQuickJumpSourceEntityId:"sensor.watch_area",roomQuickJumpEnabled:!1,roomAutoSwitchEnabled:!1,topSectionDoubleTapAction:"Room Jump",handGestureAction:"Refresh"}},{op:{switch:!1},before:{},after:{roomQuickJumpEnabled:!1,roomAutoSwitchEnabled:!1}},{op:{switch:!1},before:{topSectionDoubleTapAction:"Room Jump"},after:{roomQuickJumpEnabled:!1,roomAutoSwitchEnabled:!1,topSectionDoubleTapAction:"Disabled"}},{op:{switch:!1},before:{roomAutoSwitchEnabled:!1,handGestureAction:"Room Jump"},after:{roomQuickJumpEnabled:!1,roomAutoSwitchEnabled:!1,handGestureAction:"Refresh"}},{op:{switch:!1},before:{topSectionDoubleTapAction:"Activate Scene",handGestureAction:"Next Page"},after:{roomQuickJumpEnabled:!1,roomAutoSwitchEnabled:!1,topSectionDoubleTapAction:"Activate Scene",handGestureAction:"Next Page"}},{op:{switch:!1},before:{roomQuickJumpEnabled:!0,topSectionDoubleTapAction:"Disabled"},after:{roomQuickJumpEnabled:!1,roomAutoSwitchEnabled:!1,topSectionDoubleTapAction:"Disabled"}},{op:{switch:!1},before:{roomQuickJumpSourceEntityId:"sensor.watch_area",roomQuickJumpEnabled:!0,roomAutoSwitchEnabled:!0,topSectionDoubleTapAction:"Room Jump",handGestureAction:"Room Jump"},after:{roomQuickJumpSourceEntityId:"sensor.watch_area",roomQuickJumpEnabled:!1,roomAutoSwitchEnabled:!1,topSectionDoubleTapAction:"Disabled",handGestureAction:"Refresh"}},{op:{trigger:"Automatic"},before:{},after:{roomQuickJumpEnabled:!1,roomAutoSwitchEnabled:!0}},{op:{trigger:"Automatic"},before:{topSectionDoubleTapAction:"Room Jump"},after:{roomQuickJumpEnabled:!1,roomAutoSwitchEnabled:!0,topSectionDoubleTapAction:"Disabled"}},{op:{trigger:"Automatic"},before:{roomAutoSwitchEnabled:!1,handGestureAction:"Room Jump"},after:{roomQuickJumpEnabled:!1,roomAutoSwitchEnabled:!0,handGestureAction:"Refresh"}},{op:{trigger:"Automatic"},before:{topSectionDoubleTapAction:"Activate Scene",handGestureAction:"Next Page"},after:{roomQuickJumpEnabled:!1,roomAutoSwitchEnabled:!0,topSectionDoubleTapAction:"Activate Scene",handGestureAction:"Next Page"}},{op:{trigger:"Automatic"},before:{roomQuickJumpEnabled:!0,topSectionDoubleTapAction:"Disabled"},after:{roomQuickJumpEnabled:!1,roomAutoSwitchEnabled:!0,topSectionDoubleTapAction:"Disabled"}},{op:{trigger:"Automatic"},before:{roomQuickJumpSourceEntityId:"sensor.watch_area",roomQuickJumpEnabled:!0,roomAutoSwitchEnabled:!0,topSectionDoubleTapAction:"Room Jump",handGestureAction:"Room Jump"},after:{roomQuickJumpSourceEntityId:"sensor.watch_area",roomQuickJumpEnabled:!1,roomAutoSwitchEnabled:!0,topSectionDoubleTapAction:"Disabled",handGestureAction:"Refresh"}},{op:{trigger:"Double-Tap Top"},before:{},after:{roomQuickJumpEnabled:!1,roomAutoSwitchEnabled:!1,topSectionDoubleTapAction:"Room Jump"}},{op:{trigger:"Double-Tap Top"},before:{topSectionDoubleTapAction:"Room Jump"},after:{roomQuickJumpEnabled:!1,roomAutoSwitchEnabled:!1,topSectionDoubleTapAction:"Room Jump"}},{op:{trigger:"Double-Tap Top"},before:{roomAutoSwitchEnabled:!1,handGestureAction:"Room Jump"},after:{roomQuickJumpEnabled:!1,roomAutoSwitchEnabled:!1,topSectionDoubleTapAction:"Room Jump",handGestureAction:"Refresh"}},{op:{trigger:"Double-Tap Top"},before:{topSectionDoubleTapAction:"Activate Scene",handGestureAction:"Next Page"},after:{roomQuickJumpEnabled:!1,roomAutoSwitchEnabled:!1,topSectionDoubleTapAction:"Room Jump",handGestureAction:"Next Page"}},{op:{trigger:"Double-Tap Top"},before:{roomQuickJumpEnabled:!0,topSectionDoubleTapAction:"Disabled"},after:{roomQuickJumpEnabled:!1,roomAutoSwitchEnabled:!1,topSectionDoubleTapAction:"Room Jump"}},{op:{trigger:"Double-Tap Top"},before:{roomQuickJumpSourceEntityId:"sensor.watch_area",roomQuickJumpEnabled:!0,roomAutoSwitchEnabled:!0,topSectionDoubleTapAction:"Room Jump",handGestureAction:"Room Jump"},after:{roomQuickJumpSourceEntityId:"sensor.watch_area",roomQuickJumpEnabled:!1,roomAutoSwitchEnabled:!1,topSectionDoubleTapAction:"Room Jump",handGestureAction:"Refresh"}},{op:{trigger:"Double Pinch"},before:{},after:{roomQuickJumpEnabled:!1,roomAutoSwitchEnabled:!1,handGestureAction:"Room Jump"}},{op:{trigger:"Double Pinch"},before:{topSectionDoubleTapAction:"Room Jump"},after:{roomQuickJumpEnabled:!1,roomAutoSwitchEnabled:!1,topSectionDoubleTapAction:"Disabled",handGestureAction:"Room Jump"}},{op:{trigger:"Double Pinch"},before:{roomAutoSwitchEnabled:!1,handGestureAction:"Room Jump"},after:{roomQuickJumpEnabled:!1,roomAutoSwitchEnabled:!1,handGestureAction:"Room Jump"}},{op:{trigger:"Double Pinch"},before:{topSectionDoubleTapAction:"Activate Scene",handGestureAction:"Next Page"},after:{roomQuickJumpEnabled:!1,roomAutoSwitchEnabled:!1,topSectionDoubleTapAction:"Activate Scene",handGestureAction:"Room Jump"}},{op:{trigger:"Double Pinch"},before:{roomQuickJumpEnabled:!0,topSectionDoubleTapAction:"Disabled"},after:{roomQuickJumpEnabled:!1,roomAutoSwitchEnabled:!1,topSectionDoubleTapAction:"Disabled",handGestureAction:"Room Jump"}},{op:{trigger:"Double Pinch"},before:{roomQuickJumpSourceEntityId:"sensor.watch_area",roomQuickJumpEnabled:!0,roomAutoSwitchEnabled:!0,topSectionDoubleTapAction:"Room Jump",handGestureAction:"Room Jump"},after:{roomQuickJumpSourceEntityId:"sensor.watch_area",roomQuickJumpEnabled:!1,roomAutoSwitchEnabled:!1,topSectionDoubleTapAction:"Disabled",handGestureAction:"Room Jump"}},{op:{clearSensor:!0},before:{},after:{roomQuickJumpEnabled:!1,roomAutoSwitchEnabled:!1}},{op:{clearSensor:!0},before:{topSectionDoubleTapAction:"Room Jump"},after:{roomQuickJumpEnabled:!1,roomAutoSwitchEnabled:!1,topSectionDoubleTapAction:"Disabled"}},{op:{clearSensor:!0},before:{roomAutoSwitchEnabled:!1,handGestureAction:"Room Jump"},after:{roomQuickJumpEnabled:!1,roomAutoSwitchEnabled:!1,handGestureAction:"Refresh"}},{op:{clearSensor:!0},before:{topSectionDoubleTapAction:"Activate Scene",handGestureAction:"Next Page"},after:{roomQuickJumpEnabled:!1,roomAutoSwitchEnabled:!1,topSectionDoubleTapAction:"Activate Scene",handGestureAction:"Next Page"}},{op:{clearSensor:!0},before:{roomQuickJumpEnabled:!0,topSectionDoubleTapAction:"Disabled"},after:{roomQuickJumpEnabled:!1,roomAutoSwitchEnabled:!1,topSectionDoubleTapAction:"Disabled"}},{op:{clearSensor:!0},before:{roomQuickJumpSourceEntityId:"sensor.watch_area",roomQuickJumpEnabled:!0,roomAutoSwitchEnabled:!0,topSectionDoubleTapAction:"Room Jump",handGestureAction:"Room Jump"},after:{roomQuickJumpEnabled:!1,roomAutoSwitchEnabled:!1,topSectionDoubleTapAction:"Disabled",handGestureAction:"Refresh"}}],readCases:[{document:{},on:!1,trigger:"Double-Tap Top"},{document:{topSectionDoubleTapAction:"Room Jump"},on:!0,trigger:"Double-Tap Top"},{document:{roomAutoSwitchEnabled:!1,handGestureAction:"Room Jump"},on:!0,trigger:"Double Pinch"},{document:{topSectionDoubleTapAction:"Activate Scene",handGestureAction:"Next Page"},on:!1,trigger:"Double-Tap Top"},{document:{roomQuickJumpEnabled:!0,topSectionDoubleTapAction:"Disabled"},on:!0,trigger:"Double-Tap Top"},{document:{roomQuickJumpSourceEntityId:"sensor.watch_area",roomQuickJumpEnabled:!0,roomAutoSwitchEnabled:!0,topSectionDoubleTapAction:"Room Jump",handGestureAction:"Room Jump"},on:!0,trigger:"Automatic"}]},fallback:{stay:"__stay__",firstAvailable:null,watchFallbackNames:["favorites","nearby","home"],rule:"Stay on current page stores the sentinel; First available page stores no key, and the watch then takes a page whose normalized name is one of watchFallbackNames, else the first page. A page id is a page's id as stored. The pages offered are the listed pages that are neither system nor hidden pages."},mappings:{rule:"roomQuickJumpMappings maps a normalized room name to a page id. A room set to no page has no key, and an empty mapping is no key at all. The watch normalizes every key before it compares, and also takes a key that contains the room or is contained by it."},pointControl:{domains:[{domain:"light",label:"Light"},{domain:"switch",label:"Switch"},{domain:"fan",label:"Fan"},{domain:"cover",label:"Cover"},{domain:"scene",label:"Scene"},{domain:"script",label:"Script"},{domain:"climate",label:"Climate"},{domain:"media_player",label:"Player"},{domain:"lock",label:"Lock"},{domain:"input_boolean",label:"Toggle"}],heading:{min:0,max:359,rule:"Degrees clockwise from north. The watch shows its compass heading, snapped to 5, for the user to type in; the panel takes a typed or dialled whole degree."},newTarget:"A target added in the panel starts at heading 0 with the entity's friendly name from its id as the label.",switches:[{key:"pointControlTapToToggle",label:"Tap to Toggle",onDetail:"Tap immediately toggles the aimed entity",offDetail:"Tap opens the point control overlay",absent:!1},{key:"pointControlLiveTile",label:"Live Point Control Tile",onDetail:"Show live needle and aimed entity on grid tile",offDetail:"Show live needle and aimed entity on grid tile",absent:!1}]},zones:{cleanCases:[{input:{kitchen:[]},output:null},{input:{den:[{entityId:"light.a",centerHeading:0}],kitchen:[]},output:{den:[{entityId:"light.a",centerHeading:0}],kitchen:[]}},{input:{den:[{entityId:" ",centerHeading:0}]},output:null},{input:{den:[{entityId:" ",centerHeading:0},{entityId:"light.a",centerHeading:10}],hall:[{entityId:"",centerHeading:0}]},output:{den:[{entityId:" ",centerHeading:0},{entityId:"light.a",centerHeading:10}]}},{input:{"living room":[{entityId:"light.tv",centerHeading:90,label:"TV"},{entityId:"switch.fan",centerHeading:180}]},output:{"living room":[{entityId:"light.tv",centerHeading:90,label:"TV"},{entityId:"switch.fan",centerHeading:180}]}}],encodeCases:[{rooms:{"living room":[{entityId:"light.tv_backlight",centerHeading:90,label:"TV / Lamp"},{entityId:"switch.fan",centerHeading:272.5}]},parsed:{"living room":[{centerHeading:90,entityId:"light.tv_backlight",label:"TV / Lamp"},{centerHeading:272.5,entityId:"switch.fan"}]},slashEscaped:!0},{rooms:{kitchen:[{entityId:"light.kitchen",centerHeading:0}]},parsed:{kitchen:[{centerHeading:0,entityId:"light.kitchen"}]},slashEscaped:!1},{rooms:{den:[]},parsed:{den:[]},slashEscaped:!1},{rooms:{b\u00FCro:[{entityId:"light.b\xFCro",centerHeading:359,label:'Schreibtisch "neu"'}]},parsed:{b\u00FCro:[{centerHeading:359,entityId:"light.b\xFCro",label:'Schreibtisch "neu"'}]},slashEscaped:!1}],decodeCases:[{json:'{"kitchen":[{"entityId":"light.a","centerHeading":0}],"living room":[{"entityId":"light.b","centerHeading":359.5,"label":"Lamp"}]}',rooms:{kitchen:[{entityId:"light.a",centerHeading:0}],"living room":[{entityId:"light.b",centerHeading:359.5,label:"Lamp"}]}},{json:'{"den":[{"entityId":"light.a","centerHeading":45,"label":"A","extra":1}]}',rooms:{den:[{entityId:"light.a",centerHeading:45,label:"A"}]}},{json:'{"den":[{"entityId":"light.a","centerHeading":45,"label":null}]}',rooms:{den:[{entityId:"light.a",centerHeading:45}]}},{json:'{"den":[]}',rooms:{den:[]}},{json:'{"den":[{"entityId":"light.a"}]}',rooms:{}},{json:'{"den":[{"entityId":"light.a","centerHeading":"45"}]}',rooms:{}},{json:'{"den":[{"entityId":"light.a","centerHeading":45}],"hall":{"entityId":"light.b"}}',rooms:{}},{json:"[]",rooms:{}},{json:"not json",rooms:{}},{json:"",rooms:{}}]}};var A=gn,p=A.keys,L=A.fallback.stay,T="Room Jump",O=A.switching.absent.handGestureAction??"Refresh",$="Room Jump",N="Disabled",ge=A.pointControl.domains.map(e=>e.domain);function y(e){return e.toLowerCase().replace(/[_-]/g," ").replace(/[^a-z0-9 ]/g," ").split(" ").filter(o=>o!=="").join(" ")}var go=/^[+-]?(?:nan|inf|infinity|(?:\d+\.?\d*|\.\d+)(?:e[+-]?\d+)?|0x(?:[0-9a-f]+\.?[0-9a-f]*|\.[0-9a-f]+)(?:p[+-]?\d+)?)$/,wo=new Set(A.roomValue.notRoom);function C(e){let o=e.trim();if(o==="")return!1;let t=o.toLowerCase();return wo.has(t)||go.test(t)?!1:/[\p{L}\p{M}]/u.test(t)}function wn(e,o){if(o===void 0)return;let t=typeof o.state=="string"?o.state.trim():"";if(e.startsWith("person."))return C(t)?t:void 0;if(C(t))return t;let n=o.attributes?.[A.roomValue.attribute];if(typeof n=="string"&&C(n))return n.trim()}function bn(e){return typeof e=="object"&&e!==null&&!Array.isArray(e)}function bo(e){if(!bn(e))return;let{entityId:o,centerHeading:t,label:n}=e;if(!(typeof o!="string"||typeof t!="number"||!Number.isFinite(t))&&!(n!=null&&typeof n!="string"))return typeof n=="string"?{entityId:o,centerHeading:t,label:n}:{entityId:o,centerHeading:t}}function H(e){if(e==null||e==="")return{ok:!0,rooms:[]};if(typeof e!="string")return{ok:!1};let o;try{o=JSON.parse(e)}catch{return{ok:!1}}if(!bn(o))return{ok:!1};let t=[];for(let[n,r]of Object.entries(o)){if(!Array.isArray(r))return{ok:!1};let i=[];for(let a of r){let s=bo(a);if(s===void 0)return{ok:!1};i.push(s)}t.push([n,i])}return{ok:!0,rooms:t}}function Y(e){let o=e.filter(([,t])=>t.length===0||t.some(n=>n.entityId.trim()!==""));if(!(o.length===0||o.every(([,t])=>t.length===0)))return o}function X(e){let o={};for(let[t,n]of e)o[t]=n.map(r=>r.label===void 0?{entityId:r.entityId,centerHeading:r.centerHeading}:{entityId:r.entityId,centerHeading:r.centerHeading,label:r.label});return JSON.stringify(o).replace(/\//g,"\\/")}function we(e,o){if(e.length!==o.length)return!1;let t=new Map(o);return t.size!==o.length?!1:e.every(([n,r])=>{let i=t.get(n);return i!==void 0&&i.length===r.length&&r.every((a,s)=>a.entityId===i[s].entityId&&a.centerHeading===i[s].centerHeading&&a.label===i[s].label)})}function J(e){return Number.isFinite(e)?(Math.round(e)%360+360)%360:0}function be(e){return["N","NE","E","SE","S","SW","W","NW"][Math.floor(((e+22.5)%360+360)%360/45)%8]}function ve(e){let o=e.indexOf(".");return o<0?e:e.slice(o+1).split("_").map(t=>t.charAt(0).toUpperCase()+t.slice(1)).join(" ")}function vn(e){return e.split(" ").filter(o=>o!=="").map(o=>o.charAt(0).toUpperCase()+o.slice(1)).join(" ")}function E(e){return typeof e=="object"&&e!==null&&!Array.isArray(e)}function B(e,o){if(e===o)return!0;if(Array.isArray(e)||Array.isArray(o))return!Array.isArray(e)||!Array.isArray(o)||e.length!==o.length?!1:e.every((t,n)=>B(t,o[n]));if(E(e)&&E(o)){let t=Object.keys(e);return t.length!==Object.keys(o).length?!1:t.every(n=>Object.hasOwn(o,n)&&B(e[n],o[n]))}return!1}var yn=new Map(A.pointControl.switches.map(e=>[e.key,e.absent]));function kn(e,o,t){return Object.hasOwn(e,o)?t!==void 0&&B(e[o],t):t===void 0||yn.has(o)&&yn.get(o)===t}function xe(e,o){let t=structuredClone(e);for(let[n,r]of o)r===void 0?delete t[n]:t[n]=structuredClone(r);return t}function ke(e,o,t){let n=new Map(o);for(let[r,i]of t)kn(e,r,i)?n.delete(r):n.set(r,i);return n}function W(e,o){return e===void 0?[]:[...o.entries()].filter(([t,n])=>!kn(e,t,n)).map(([t])=>t)}function xn(e,o,t){let n=new Map(t);for(let r of new Set([...e.keys(),...o.keys()])){let i=e.get(r),a=o.get(r);B(i,a)||(a===void 0?n.delete(r):n.set(r,a))}return n}function ye(e){return new Map(E(e)?Object.entries(e):[])}function Se(e,o,t){let n=new Map(t);for(let[r,i]of t)if(!B(e[r],o[r])){if(r===p.mappings){let a=xn(ye(e[r]),ye(i),ye(o[r]));n.set(r,a.size===0?void 0:Object.fromEntries(a))}else if(r===p.zones){let a=H(e[r]),s=H(i),c=H(o[r]);if(!a.ok||!s.ok||!c.ok)continue;let l=Y([...xn(new Map(a.rooms),new Map(s.rooms),new Map(c.rooms))]);l===void 0?n.set(r,void 0):n.set(r,we(l,c.rooms)?o[r]:X(l))}else if(r===p.topSectionDoubleTap||r===p.handGesture){let a=r===p.topSectionDoubleTap?$:T;e[r]===a&&i!==a&&o[r]!==a&&n.delete(r)}}return n}function z(e,o){let t=e[o];return typeof t=="string"?t:void 0}function ee(e,o){let t=e[o];return typeof t=="boolean"?t:void 0}function U(e){let o={},t=z(e,p.sensor);t!==void 0&&(o.roomQuickJumpSourceEntityId=t);let n=ee(e,p.legacyQuickJump);n!==void 0&&(o.roomQuickJumpEnabled=n);let r=ee(e,p.autoSwitch);r!==void 0&&(o.roomAutoSwitchEnabled=r);let i=z(e,p.topSectionDoubleTap);i!==void 0&&(o.topSectionDoubleTapAction=i);let a=z(e,p.handGesture);return a!==void 0&&(o.handGestureAction=a),o}function vo(e){let o=U(e),t=o.topSectionDoubleTapAction===$||(o.roomQuickJumpEnabled??!1),n=(o.handGestureAction??O)===T;return t||(o.roomAutoSwitchEnabled??!1)||n}function yo(e){let o=U(e);return o.roomAutoSwitchEnabled??!1?"Automatic":(o.handGestureAction??O)===T?"Double Pinch":"Double-Tap Top"}function te(e){let o={},t=e[p.mappings];if(E(t))for(let[r,i]of Object.entries(t))typeof i=="string"&&(o[r]=i);let n=r=>ee(e,r)??A.pointControl.switches.find(i=>i.key===r)?.absent??!1;return{sensor:(z(e,p.sensor)??"").trim(),switching:vo(e),trigger:yo(e),fallback:(z(e,p.fallback)??"").trim(),mappings:o,zones:H(e[p.zones]),tapToToggle:n(p.tapToToggle),liveTile:n(p.liveTile)}}function Re(e,o){let t=new Map;for(let n of A.switching.keys)e[n]!==o[n]&&t.set(n,o[n]);return t}function xo(e){delete e.roomQuickJumpSourceEntityId,e.roomQuickJumpEnabled=!1,e.roomAutoSwitchEnabled=!1,e.handGestureAction===T&&(e.handGestureAction=O),e.topSectionDoubleTapAction===$&&(e.topSectionDoubleTapAction=N)}function Sn(e,o){let t=o.trim();return t!==""?new Map([[p.sensor,t]]):ko(e)}function ko(e){let o=U(e),t={...o};return xo(t),Re(o,t)}function Rn(e,o){let t=U(e),n={...t};return o?(n.topSectionDoubleTapAction=$,n.roomQuickJumpEnabled=!1,n.roomAutoSwitchEnabled=!1,n.handGestureAction===T&&(n.handGestureAction=O)):(n.roomQuickJumpEnabled=!1,n.roomAutoSwitchEnabled=!1,n.handGestureAction===T&&(n.handGestureAction=O),n.topSectionDoubleTapAction===$&&(n.topSectionDoubleTapAction=N)),Re(t,n)}function Ae(e,o){let t=U(e),n={...t};switch(o){case"Automatic":n.roomAutoSwitchEnabled=!0,n.roomQuickJumpEnabled=!1,n.handGestureAction===T&&(n.handGestureAction=O),n.topSectionDoubleTapAction===$&&(n.topSectionDoubleTapAction=N);break;case"Double-Tap Top":n.roomAutoSwitchEnabled=!1,n.roomQuickJumpEnabled=!1,n.topSectionDoubleTapAction=$,n.handGestureAction===T&&(n.handGestureAction=O);break;case"Double Pinch":n.roomAutoSwitchEnabled=!1,n.roomQuickJumpEnabled=!1,n.topSectionDoubleTapAction===$&&(n.topSectionDoubleTapAction=N),n.handGestureAction=T;break}return Re(t,n)}function An(e){let o=e.trim();return new Map([[p.fallback,o===""?void 0:o]])}function En(e,o){return new Map([[e,o]])}function Q(e,o){let t=e.mappings[o];if(t!==void 0)return t.trim();for(let[n,r]of Object.entries(e.mappings))if(y(n)===o)return r.trim();return""}function Ee(e,o,t){let n=e[p.mappings],r=E(n)?structuredClone(n):{};for(let a of Object.keys(r))y(a)===o&&delete r[a];let i=t.trim();return i!==""&&(r[o]=i),new Map([[p.mappings,Object.keys(r).length===0?void 0:r]])}function Te(e,o){return e.filter(([t])=>y(t)===o).flatMap(([,t])=>t)}function $e(e,o,t){let n=H(e[p.zones]);if(!n.ok)return;let r=[],i=!1;for(let[s,c]of n.rooms)y(s)!==o?r.push([s,c]):i||(r.push([o,t]),i=!0);i||r.push([o,t]);let a=Y(r);return a===void 0?new Map([[p.zones,void 0]]):we(a,n.rooms)?new Map:new Map([[p.zones,X(a)]])}function Tn(e,o){let t=new Map,n=te(e);if(Q(n,o)!==""||Object.keys(n.mappings).some(i=>y(i)===o))for(let[i,a]of Ee(e,o,""))t.set(i,a);let r=H(e[p.zones]);if(r.ok&&r.rooms.some(([i])=>y(i)===o)){let i=Y(r.rooms.filter(([a])=>y(a)!==o));t.set(p.zones,i===void 0?void 0:X(i))}return t}function De(e,o,t){return o.lastSeen!==void 0||Q(e,o.key)!==""||Object.keys(e.mappings).some(n=>y(n)===o.key)||e.zones.ok&&e.zones.rooms.some(([n])=>y(n)===o.key)?!0:t.some(n=>y(n)===o.key)}function $n(e){return M(e).filter(o=>!_t(o)&&!Dt(o)&&I(o)!=="").map(o=>({id:I(o),name:q(o)}))}function ne(e,o){let t=o.trim().toLowerCase();return t===""?void 0:e.find(n=>n.id.toLowerCase()===t)}function Dn(e){let o=new Map,t=new Map;for(let s of e.history??[]){if(!C(s.state))continue;let c=y(s.state.trim());if(c==="")continue;let l=t.get(c);(l===void 0||s.at>l.at)&&t.set(c,{at:s.at,state:s.state.trim()})}let n=(s,c,l,u)=>{let b=y(s);if(b===""||o.has(b))return;let g=t.get(b)?.at;o.set(b,{key:b,name:l??vn(b),area:c,...g===void 0?{}:{lastSeen:g},...u===void 0||u===""?{}:{floorId:u}})};for(let s of e.areas??[])for(let c of[s.name,...s.aliases??[]]){let l=typeof c=="string"?c.trim():"";l!==""&&n(l,!0,l,s.floorId)}for(let s of e.mappingKeys??[])n(s,!1);for(let s of e.zoneKeys??[])n(s,!1);for(let[s,c]of t)o.has(s)||n(s,!1,c.state);for(let s of e.added??[])n(s,!1,s.trim());let r=[...o.values()],i=r.filter(s=>s.lastSeen!==void 0).sort((s,c)=>c.lastSeen-s.lastSeen),a=r.filter(s=>s.lastSeen===void 0).sort((s,c)=>s.name.localeCompare(c.name,void 0,{sensitivity:"base"}));return[...i,...a]}function _n(e){if(!Array.isArray(e))return[];let o=[];for(let t of e){if(!E(t)||typeof t.name!="string")continue;let n=Array.isArray(t.aliases)?t.aliases.filter(i=>typeof i=="string"):[],r=typeof t.floor_id=="string"&&t.floor_id!==""?t.floor_id:void 0;o.push({name:t.name,aliases:n,...r===void 0?{}:{floorId:r}})}return o}function On(e){return Object.values(e??{}).flatMap(o=>{if(typeof o.name!="string"||o.name.trim()==="")return[];let t=typeof o.floor_id=="string"&&o.floor_id!==""?o.floor_id:void 0;return[{name:o.name,...t===void 0?{}:{floorId:t}}]})}function _e(e){let o=Array.isArray(e)?e:E(e)?Object.values(e):[],t=[];for(let n of o){if(!E(n)||typeof n.floor_id!="string"||n.floor_id==="")continue;let r=typeof n.name=="string"&&n.name.trim()!==""?n.name.trim():n.floor_id;t.some(i=>i.id===n.floor_id)||t.push({id:n.floor_id,name:r})}return t}function Hn(e,o){if(!E(e))return[];let t=e[o];if(!Array.isArray(t))return[];let n=[];for(let r of t){if(!E(r))continue;let i=typeof r.s=="string"?r.s:typeof r.state=="string"?r.state:void 0;if(i===void 0)continue;let a,s=typeof r.lc=="number"?r.lc:typeof r.lu=="number"?r.lu:void 0;if(s!==void 0)a=s*1e3;else{let c=typeof r.last_changed=="string"?r.last_changed:typeof r.last_updated=="string"?r.last_updated:void 0,l=c===void 0?NaN:Date.parse(c);Number.isNaN(l)||(a=l)}n.push({state:i,at:a??0})}return n}var Pn=24,So=64*1024;function Oe(e,o="behavior"){return{size:new TextEncoder().encode(JSON.stringify(e)).length,limit:o==="rooms"?So:$t}}var Ro=3;async function Mn(e,o,t){let n=o,r;for(let i=1;;i++){if(i>1&&W(n.document,t).length===0)return{ok:!0,revision:n.revision,document:n.document,merged:!0,alreadySaved:!0,...r?{fresh:r}:{}};let a=xe(n.document,t);try{let{revision:s}=await e.save(n.revision,a);return{ok:!0,revision:s,document:a,merged:i>1,alreadySaved:!1,...r?{fresh:r}:{}}}catch(s){let{code:c="unknown",message:l}=_(s);if(c!=="conflict"||i>=Ro)return{ok:!1,code:c,message:l,...r?{fresh:r}:{}};try{r=await e.fetch()}catch(u){let b=_(u);return{ok:!1,code:b.code??"unknown",message:b.message}}if(!(r.revision>0)||!E(r.document))return{ok:!1,code:"no_record",message:"Home Assistant holds no settings for this watch.",fresh:r};t=Se(n.document,r.document,t),n={revision:r.revision,document:r.document}}}}function He(e){return e!==void 0&&e.revision>0&&E(e.document)?e.document:void 0}var In="No watch settings from this watch yet.",vr=Pe(void 0);function Pe(e,o){return`Rooms are part of the watch's settings. ${j(e,o)}`}var Cn="Home Assistant holds settings for this watch that this panel cannot read. Update the integration.",Ln="The point control targets stored for this watch cannot be read, so they are shown as none and left as they are. Update the integration to change them here.",Me={stay:"Stay on current page",first:"First available page"};function Nn(e,o="behavior"){let t=o==="rooms";if(e.ok)return e.alreadySaved?{kind:"ok",text:`Nothing left to save. The ${t?"rooms":"settings"} already had these changes, as revision ${e.revision}.`}:e.merged?{kind:"ok",text:t?"Saved. Room changes made elsewhere meanwhile were kept.":"Saved. Settings changed elsewhere meanwhile were kept."}:void 0;let n=e.message.trim();switch(e.code){case"conflict":return{kind:"warn",text:`Not saved. ${t?"This home's rooms":"The watch's settings"} kept changing elsewhere while saving. Your edits are kept, so try Save again in a moment.`};case"no_record":return{kind:"warn",text:t?"Not saved. Home Assistant no longer holds rooms for this home.":"Not saved. Home Assistant no longer holds settings for this watch."};case"not_for_iphone":return{kind:"err",text:`Not saved. ${Et}`};case"busy":return{kind:"warn",text:"Already saving. Wait a moment for that save to finish."};case"unavailable":return{kind:"warn",text:`Not saved. Home Assistant could not store the ${t?"rooms":"settings"} just now. Your edits are kept, so try again in a moment.`};default:return{kind:"err",text:`Not saved${n===""?".":`: ${n}`}`}}}function Ie(e){return e===""?"first":e===L?"stay":"page"}function Jn(e){return e?.device_kind==="iphone"||vt(e)?"rooms":"behavior"}var Ao=1,yr=[p.legacyQuickJump,p.sensor,p.fallback,p.mappings,p.autoSwitch,p.zones],Eo=[p.topSectionDoubleTap,p.handGesture,p.tapToToggle,p.liveTile];function Ce(e){return new Map([...e].filter(([o])=>!Eo.includes(o)))}function zn(e){return ee(e,p.autoSwitch)??!1}function Bn(e,o){return Ce(o?Ae(e,"Automatic"):new Map([[p.autoSwitch,!1]]))}function Wn(){return{schemaVersion:Ao}}function Un(e){let o=_(e).code;return o==="invalid"||o==="unknown_command"}var Qn="The double-tap on the page title, the double pinch and the point control switches come from this watch's main home.",Fn="The double-tap on the page title is in this iPhone's settings.",Gn="No rooms for this home yet.",Kn="Update the integration to edit this home's rooms here.",Vn="Home Assistant holds rooms for this home that this panel cannot read. Update the integration.",jn="Switch automatically";var To=100,oe=class{constructor(o,t){this.edits=new Map;this.undoStack=[];this.redoStack=[];this.saving=!1;this.document=o,this.revision=t}get effective(){return xe(this.document,this.edits)}get pending(){return this.edits}get dirty(){return W(this.document,this.edits).length>0}get canUndo(){return this.undoStack.length>0}get canRedo(){return this.redoStack.length>0}apply(o,t){if(this.saving)return!1;let n=ke(this.document,this.edits,o);return $o(n,this.edits)?!1:((t===void 0||t!==this.coalesceKey)&&(this.undoStack.push(new Map(this.edits)),this.undoStack.length>To&&this.undoStack.shift()),this.coalesceKey=t,this.redoStack=[],this.edits=n,!0)}endCoalesce(){this.coalesceKey=void 0}undo(){if(this.saving)return!1;let o=this.undoStack.pop();return o===void 0?!1:(this.redoStack.push(this.edits),this.edits=o,this.coalesceKey=void 0,!0)}redo(){if(this.saving)return!1;let o=this.redoStack.pop();return o===void 0?!1:(this.undoStack.push(this.edits),this.edits=o,this.coalesceKey=void 0,!0)}discard(){return this.edits.size===0||this.saving?!1:(this.undoStack.push(this.edits),this.redoStack=[],this.edits=new Map,this.coalesceKey=void 0,!0)}rebase(o,t){let n=Se(this.document,o,this.edits);return this.document=o,this.revision=t,this.edits=ke(o,new Map,n),this.undoStack=[],this.redoStack=[],this.coalesceKey=void 0,this.edits.size>0}};function $o(e,o){if(e.size!==o.size)return!1;for(let[t,n]of e)if(!o.has(t)||JSON.stringify(n)!==JSON.stringify(o.get(t)))return!1;return!0}var D=new Map;function re(e){return D.get(e)}function qn(e){D.delete(e)}function Le(e,o,t){let n=D.get(e);if(n===void 0){let a=new oe(o,t);return D.set(e,a),{draft:a,mergedIntoEdits:!1}}if(n.saving||t===n.revision)return{draft:n,mergedIntoEdits:!1};let r=n.dirty,i=n.rebase(o,t);return{draft:n,mergedIntoEdits:r&&i}}function Ne(e,o){let t=D.get(e);if(t===void 0){let n=new oe(o,0);return D.set(e,n),n}return t.revision>0&&!t.saving&&t.rebase(o,0),t}function Je(){for(let e of D.values())if(e.dirty)return!0;return!1}function Zn(){for(let[e,o]of D)o.saving||D.delete(e)}async function Yn(e,o){if(e.saving)return{ok:!1,code:"busy",message:"A save is running."};let t=new Map(e.pending);e.saving=!0;let n=Mn(o,{revision:e.revision,document:e.document},t);e.saveDone=n;try{let r=await n;if(e.saving=!1,r.ok)e.rebase(r.document,r.revision);else if(r.fresh!==void 0&&r.fresh.revision>0){let i=r.fresh.document;i!==void 0&&typeof i=="object"&&!Array.isArray(i)&&e.rebase(i,r.fresh.revision)}return r}finally{e.saving=!1}}var Xn="var(--wa-hue-pink)",Ue={width:208,height:248};function Be(e,o){let t=e.states[o]?.attributes?.friendly_name;return typeof t=="string"&&t.trim()!==""?t:o}function Qe(e,o){let t=o.indexOf(".");return{entityId:o,displayName:o===""?"":Be(e,o),domain:t<0?"":o.slice(0,t)}}function Fe(e,o){return o.some(t=>e.dirty.has(t))}function Ge(e){return e?d`<span class="sec-dot rm-dirty" title="Changed, not saved yet" aria-label="Changed"></span>`:m}function Ke(e,o,t=!1){let n=e.uiState.get(o);return typeof n=="boolean"?n:t}function Ve(e,o,t){e.uiState.set(o,!t),e.requestUpdate()}function R(e){return e.phone===!0?"iPhone":"watch"}function Do(e,o,t="watch"){if(o==="")return{line:je(t),tone:"none"};let n=e.states[o];if(n===void 0)return{line:"Home Assistant has no entity with this id now.",tone:"warn"};let r=wn(o,n),i=typeof n.state=="string"?n.state:"";if(r===void 0)return{line:`Now "${i}", which the ${t} does not read as a room.`,tone:"warn"};let a=y(r);return{line:`Now in ${r}${a===""?`, whose name has no letter or digit the ${t} can match`:""}.`,tone:a===""?"warn":"ok"}}var We="https://github.com/agittins/bermuda";function je(e="watch"){return`No room sensor picked. The ${e} looks for one by its name, such as a Bermuda area sensor. Pick one to be sure.`}var Pr=je();function no(e="watch"){return`Bermuda uses Bluetooth to tell which room your ${e} is in. Rooms works best with its area sensor. Add Bermuda to Home Assistant, then pick its sensor here.`}var Mr=no();function _o(e,o){if(o==="")return!1;let t=e.states[o];if((typeof t?.attributes?.device_class=="string"?t.attributes.device_class:"").toLowerCase().startsWith("bermuda"))return!0;let r=typeof t?.attributes?.friendly_name=="string"?t.attributes.friendly_name:"";return`${o} ${r}`.toLowerCase().includes("bermuda")}function Oo(e){let o=e.indexOf("Bermuda");return o<0?e:d`${e.slice(0,o)}<a href=${We} target="_blank" rel="noopener noreferrer">Bermuda</a>${e.slice(o+7)}`}function oo(e,o,t,n){let r=[...n,...o.map(i=>[i.id,i.name])];return t!==""&&!n.some(([i])=>i===t)&&ne(o,t)===void 0&&r.push([t,`A page not on this ${R(e)}`]),r}function ro(e,o){return ne(e,o)?.id??o}function Ho(e,o){return o===""?"":ne(e.pages,o)?.name??`A page not on this ${R(e)}`}function io(e,o){let t=o.trim().toLowerCase();if(t!=="")return M(e.pagesDocument).find(n=>I(n).toLowerCase()===t)}function qe(e,o,t,n,r,i=""){return d`<select class="rm-select ${i}" aria-label=${e} ?disabled=${r}
    @click=${a=>a.stopPropagation()}
    @change=${a=>{r||n(a.target.value)}}>
    ${t.map(([a,s])=>d`<option value=${a} .selected=${a===o}>${s}</option>`)}
  </select>`}function Po(e){return e.rooms.filter(o=>De(e.view,o,e.added??[]))}function Mo(e){return e.rooms.filter(o=>o.area&&!De(e.view,o,e.added??[]))}function Io(e,o){let t=e.uiState.get("pick");return o.find(n=>n.key===t)??o[0]}function Co(e,o=[]){let t=new Set(o.map(i=>i.id)),n=o.map(i=>({name:i.name,rooms:e.filter(a=>a.floorId===i.id)})).filter(i=>i.rooms.length>0),r=e.filter(i=>i.floorId===void 0||!t.has(i.floorId));return r.length>0&&n.push({name:n.length>0?"Other":"",rooms:r}),n}function F(e,o){e.uiState.set("pick",o),e.requestUpdate()}function Lo(e,o){let t=e.view.zones.ok?Te(e.view.zones.rooms,o.key).length:0;return t===0?"":t===1?"1 thing to point at":`${t} things to point at`}function ao(e,o){let t=y(o);t!==""&&(e.addRoom(o.trim()),F(e,t))}function No(e){return e.home===!0?zn(e.document):e.view.switching}function eo(e){let{view:o}=e;return d`<div class="rm-stack rm-sensor-field" title=${o.sensor===""?"":"Clearing the sensor turns Switch pages by room off."}>${Z({hass:e.hass},"Room sensor",Qe(e.hass,o.sensor),t=>{e.busy||e.write(Sn(e.document,t.entityId))},"rooms:sensor",{clearable:!0})}</div>`}function to(e){let o=e.home===!0,t=No(e),n=o?jn:"Switch pages by room",r=s=>{e.busy||e.write(o?Bn(e.document,s):Rn(e.document,s))},i=A.switching.triggers,a=i.find(s=>s.value===e.view.trigger)?.help??"";return d`<div class="rm-status-switch">${ue(n,t,r)}</div>
    ${o?d`<p class="rm-help rm-status-wide rm-main-house">${e.phone===!0?Fn:Qn}</p>`:t?d`<div class="rm-when rm-status-wide">
        <span class="rm-when-l" id="rm-when-l">Switch</span>
        <div class="seg rm-seg" role="radiogroup" aria-labelledby="rm-when-l">
          ${i.map(s=>{let c=s.value===e.view.trigger;return d`<button type="button" role="radio" aria-checked=${c?"true":"false"} class=${c?"on":""} ?disabled=${e.busy}
              @click=${()=>{!e.busy&&!c&&e.write(Ae(e.document,s.value))}}>${s.label}</button>`})}
        </div>
        <span class="rm-when-help">${a}</span>
      </div>`:m}`}var Jo=[p.sensor,p.autoSwitch,p.legacyQuickJump,p.topSectionDoubleTap,p.handGesture];function zo(e){let{view:o}=e,t=Ge(Fe(e,Jo));if(o.sensor==="")return d`<section class="rm-card rm-lit rm-start" aria-label="Start here">
      <span class="rm-eyebrow">Start here${t}</span>
      <h3 class="rm-start-title">Tell the ${R(e)} which room you are in</h3>
      <p class="rm-pitch">${no(R(e))}</p>
      <div class="rm-start-row">
        ${eo(e)}
        <a class="rm-btn rm-bermuda-link" href=${We} target="_blank" rel="noopener noreferrer">Get Bermuda</a>
      </div>
      <p class="rm-help">${Oo(je(R(e)))}</p>
      <div class="rm-start-switch">${to(e)}</div>
    </section>`;let n=Ke(e,"sensorOpen"),r=_o(e.hass,o.sensor),i=Do(e.hass,o.sensor,R(e));return d`<section class="rm-card rm-lit rm-status" aria-label="Switch pages by room">
    <span class="rm-ichip" aria-hidden="true">${x("home")}</span>
    <div class="rm-status-text">
      <p class="rm-now">The ${R(e)} opens a room's page when the room sensor says you walked in.${t}</p>
      <div class="rm-sensor-line">
        ${r?d`<span class="rm-bermuda-ok">${x("check")}<span>${Be(e.hass,o.sensor)}, a Bermuda sensor</span></span>`:d`<span class="rm-sensor-name">${Be(e.hass,o.sensor)}.</span>
            <span class="rm-sensor-hint"><a href=${We} target="_blank" rel="noopener noreferrer">Bermuda</a> works best.</span>`}
        <button type="button" class="rm-btn rm-small" aria-expanded=${n?"true":"false"}
          @click=${()=>Ve(e,"sensorOpen",n)}>${n?"Done":"Change"}</button>
      </div>
    </div>
    ${!n&&i.tone==="warn"?d`<div class="rm-reading rm-status-wide"><i class="rm-dot warn" aria-hidden="true"></i><span>${i.line}</span></div>`:m}
    ${n?d`<div class="rm-sensor-edit rm-status-wide">
      ${eo(e)}
      <div class="rm-reading"><i class="rm-dot ${i.tone}" aria-hidden="true"></i><span>${i.line}</span></div>
    </div>`:m}
    ${to(e)}
  </section>`}var ze=.16;function so(e,o){return Math.round((e.screen??Ue).height*o*100)/100}function co(e,o){let t=io(e,o),n=e.screen??Ue,r=`--rm-screen-h: ${so(e,ze)}px; --rm-thumb-w: ${Math.round(n.width*ze)}px`;return t===void 0?d`<span class="rm-thumb empty" aria-hidden="true" style=${r}></span>`:d`<span class="rm-thumb" aria-hidden="true" title=${q(t)} style=${r}>${me({page:t,pages:[t],screen:n,states:e.hass.states,...e.icons?{icons:e.icons}:{},scale:ze,...e.appVersion===void 0?{}:{appVersion:e.appVersion}})}</span>`}function Bo(e,o,t){let n=Q(e.view,o.key),r=ro(e.pages,n),i=Tn(e.document,o.key),a=i.size>0||(e.added??[]).some(l=>y(l)===o.key),s=l=>{l.stopPropagation(),!e.busy&&(e.forgetRoom?.(o.key),i.size>0&&e.write(i),e.requestUpdate())},c=Lo(e,o);return d`<li class="rm-row ${t?"on":""}" @click=${()=>F(e,o.key)}>
    <span class="rm-row-room">
      <button type="button" class="rm-row-name" aria-pressed=${t?"true":"false"} title=${`Show this room on the ${R(e)}`}
        @click=${l=>{l.stopPropagation(),F(e,o.key)}}>${o.name}</button>
      ${c===""?m:d`<span class="rm-row-sub">${c}</span>`}
    </span>
    <span class="rm-arrow" aria-hidden="true">${x("arrow")}</span>
    <span class="rm-row-page">
      ${co(e,n)}
      ${qe(`Page for ${o.name}`,r,oo(e,e.pages,r,[["","No page"]]),l=>{e.write(Ee(e.document,o.key,l)),F(e,o.key)},e.busy)}
    </span>
    <span class="rm-row-end">${a?d`<button type="button" class="rm-row-x" aria-label=${`Remove ${o.name}`} ?disabled=${e.busy}
      title="Take this room off: its page and its things to point at go. Undo brings them back." @click=${s}>${x("close")}</button>`:m}</span>
  </li>`}function Wo(e,o){let t=String(e.uiState.get("addRoom")??""),n=y(t),r=n!==""&&o.some(a=>a.key===n),i=()=>{n===""||r||(e.uiState.set("addRoom",""),ao(e,t))};return d`<div class="rm-add-room">
    <input type="text" placeholder="Add a room by name" aria-label="Room name" .value=${t}
      @input=${a=>{e.uiState.set("addRoom",a.target.value),e.requestUpdate()}}
      @keydown=${a=>{a.key==="Enter"&&(a.preventDefault(),i())}} />
    <button type="button" class="rm-btn" ?disabled=${n===""||r} @click=${i}>${x("plus")}<span>Add</span></button>
  </div>
  ${t.trim()!==""&&n===""?d`<p class="rm-help warn">The ${R(e)} matches room names by their letters a to z and digits, and this name has none.</p>`:m}
  ${r?d`<p class="rm-help">That room is in the list.</p>`:d`<p class="rm-help">For a name the sensor says that is not an area in Home Assistant.</p>`}`}function Uo(e){let o=Ie(e.view.fallback),t=o==="first"?"":o==="stay"?L:ro(e.pages,e.view.fallback);return d`<div class="rm-row rm-else">
    <span class="rm-row-room">
      <b class="rm-else-name">Anywhere else</b>
      <span class="rm-row-sub">A room with no page, or when the room cannot be told</span>
    </span>
    <span class="rm-arrow" aria-hidden="true">${x("arrow")}</span>
    <span class="rm-row-page">
      ${co(e,o==="page"?e.view.fallback:"")}
      ${qe("Page anywhere else",t,oo(e,e.pages,t,[[L,Me.stay],["",Me.first]]),n=>e.write(An(n)),e.busy)}
    </span>
    <span class="rm-row-end"></span>
  </div>`}function Qo(e,o,t){let n=Mo(e),r=Co(o,e.floors),i=Ke(e,"moreOpen",o.length===0),a=n.length===0?"Add a room":`${n.length} more ${n.length===1?"area":"areas"} in Home Assistant`;return d`<section class="rm-card rm-rules" aria-label="Room pages">
    <div class="rm-rules-head">
      <span class="rm-cap">When I walk into${Ge(Fe(e,[p.mappings,p.fallback]))}</span>
      <span class="rm-cap rm-cap-page">the ${R(e)} opens</span>
    </div>
    ${o.length===0?d`<div class="rm-none">
          <b>${e.roomsState==="loading"?"Reading your rooms":"No rooms yet"}</b>
          <span>${e.roomsState==="loading"?"The areas and what the room sensor reported.":n.length>0?"Pick an area below, or type a name.":"Type a room's name below."}</span>
        </div>`:r.map(s=>d`<div class="rm-group" role="group" aria-label=${s.name===""?"Rooms":s.name}>
          ${s.name===""?m:d`<span class="rm-floor">${s.name}</span>`}
          <ul class="rm-rows">${s.rooms.map(c=>Bo(e,c,c.key===t?.key))}</ul>
        </div>`)}
    ${Uo(e)}
    <button type="button" class="rm-fold" aria-expanded=${i?"true":"false"} @click=${()=>Ve(e,"moreOpen",i)}>
      <span class="rm-chev" aria-hidden="true">${x("right")}</span>${a}
    </button>
    ${i?d`<div class="rm-more">
      ${n.length>0?d`<div class="rm-areas">
        ${n.map(s=>d`<button type="button" class="rm-area" title=${`Add ${s.name} to your rooms`} @click=${()=>ao(e,s.name)}>+ ${s.name}</button>`)}
        <span class="rm-help rm-areas-help">Click one to give it a page.</span>
      </div>`:m}
      ${Wo(e,o)}
    </div>`:m}
  </section>`}function Fo(e,o,t,n){let r=Math.atan2(e-t,n-o)*180/Math.PI;return J(r)}function Go(e,o,t,n,r){let i=o[t].centerHeading,a=26,s=32,c=(g,v)=>{let k=g*Math.PI/180;return{x:s+Math.sin(k)*v,y:s-Math.cos(k)*v}},l=c(i,a-3),u=g=>{if(e.busy||g.button!==0)return;let v=g.currentTarget,k=v.getBoundingClientRect(),Xe=k.width/64,ie=et=>n(Fo((et.clientX-k.left)/Xe,(et.clientY-k.top)/Xe,s,s),r);ie(g),v.setPointerCapture?.(g.pointerId);let K=()=>{v.removeEventListener("pointermove",ie),v.removeEventListener("pointerup",K),v.removeEventListener("pointercancel",K),e.endCoalesce()};v.addEventListener("pointermove",ie),v.addEventListener("pointerup",K),v.addEventListener("pointercancel",K)},b=g=>{let v=g.shiftKey?15:1;if(g.key==="ArrowRight"||g.key==="ArrowUp")n(J(i+v),r);else if(g.key==="ArrowLeft"||g.key==="ArrowDown")n(J(i-v),r);else return;g.preventDefault()};return d`<svg class="rm-dial" viewBox="0 0 64 64" role="slider" tabindex="0" aria-label="Heading"
    aria-valuemin="0" aria-valuemax="359" aria-valuenow=${Math.round(i)} aria-valuetext=${`${Math.round(i)} degrees, ${be(i)}`}
    @pointerdown=${u} @keydown=${b} @blur=${()=>e.endCoalesce()}>
    <circle class="rm-dial-face" cx=${s} cy=${s} r=${a}></circle>
    ${[0,90,180,270].map(g=>{let v=c(g,a-1),k=c(g,a-5);return ae`<line class="rm-dial-tick" x1=${v.x} y1=${v.y} x2=${k.x} y2=${k.y}></line>`})}
    <text class="rm-dial-n" x=${s} y="13">N</text>
    ${o.map((g,v)=>{if(v===t)return m;let k=c(g.centerHeading,a-3);return ae`<circle class="rm-dial-other" cx=${k.x} cy=${k.y} r="2"></circle>`})}
    <line class="rm-dial-needle" x1=${s} y1=${s} x2=${l.x} y2=${l.y}></line>
    <circle class="rm-dial-tip" cx=${l.x} cy=${l.y} r="3.2"></circle>
    <circle class="rm-dial-hub" cx=${s} cy=${s} r="2.2"></circle>
  </svg>`}function Ko(e,o,t,n){let r=t[n],i=(c,l)=>{if(e.busy)return;let u=t.flatMap((g,v)=>{if(v!==n)return[g];let k=c(g);return k===void 0?[]:[k]}),b=$e(e.document,o,u);b!==void 0&&e.write(b,l)},a=(c,l)=>i(u=>({...u,centerHeading:J(c)}),l),s=`target:${o}:${n}`;return d`<div class="rm-target">
    ${Go(e,t,n,a,`${s}:heading`)}
    <div class="rm-target-fields">
      <div class="rm-stack">${Z({hass:e.hass},"Entity",Qe(e.hass,r.entityId),c=>{let l=c.entityId.trim();l===""||l===r.entityId||i(u=>({...u,entityId:l}))},`rooms:${s}:entity`,{domain:ge,clearable:!1})}</div>
      <label class="field num rm-heading">
        <span>Heading</span>
        <span class="rm-heading-box">
          <input type="number" min="0" max="359" step="1" .value=${String(Math.round(r.centerHeading))} ?disabled=${e.busy}
            aria-label="Heading in degrees"
            @change=${c=>{let l=c.target,u=Number(l.value);if(l.value.trim()===""||Number.isNaN(u)){l.value=String(Math.round(r.centerHeading));return}a(u,`${s}:typed`),e.endCoalesce()}} />
          <span class="rm-compass">° ${be(r.centerHeading)}</span>
        </span>
      </label>
      ${zt("Label",r.label??"",c=>i(l=>{let u={entityId:l.entityId,centerHeading:l.centerHeading};return c!==""&&(u.label=c),u},`${s}:label`),{placeholder:ve(r.entityId)})}
    </div>
    <button type="button" class="rm-remove" title="Remove this target" aria-label="Remove this target" ?disabled=${e.busy}
      @click=${()=>i(()=>{})}>${x("close")}</button>
  </div>`}var Vo="To read a heading, stand where you point from, face the target and open Heading on the watch (in Connection Health, or on the point control of a room with no targets). Type the number it shows.";function jo(e,o){let{view:t}=e,n=e.uiState.get(`adding:${o.key}`)===!0,r=s=>d`<div class="rm-sub-h">
    <span>Things to point at</span>
    ${t.zones.ok?d`<button type="button" class="lc-btn rm-add-thing" ?disabled=${e.busy} aria-expanded=${n?"true":"false"}
      @click=${()=>{e.uiState.set(`adding:${o.key}`,!n),e.requestUpdate()}}>${n&&s>0?"Done":"+ Add a thing"}</button>`:m}
  </div>`;if(!t.zones.ok)return d`${r(0)}<p class="rm-help warn">${Ln}</p>`;let i=Te(t.zones.rooms,o.key),a=`rooms:target-add:${o.key}`;return d`${r(i.length)}
    ${i.length===0&&!n?d`<p class="rm-help">None yet. Add a lamp or a switch you point the watch at in this room.</p>`:m}
    ${i.map((s,c)=>Ko(e,o.key,i,c))}
    ${n?d`<div class="rm-stack rm-add-target">${Z({hass:e.hass},"Add a thing",Qe(e.hass,""),s=>{let c=s.entityId.trim();if(c===""||e.busy||i.some(u=>u.entityId===c))return;let l=$e(e.document,o.key,[...i,{entityId:c,centerHeading:0,label:ve(c)}]);l!==void 0&&e.write(l),e.uiState.set(`adding:${o.key}`,!1)},a,{domain:ge,clearable:!1})}</div>`:m}
    ${i.length>0?d`<p class="rm-help" title=${Vo}>Heading is degrees clockwise from north. Drag the dial or type it.</p>`:m}`}function qo(e,o,t,n){return d`<div class="rm-switch">${ue(e,o,n)}<p class="rm-help">${t}</p></div>`}function Zo(e){let{view:o}=e,t={[p.tapToToggle]:o.tapToToggle,[p.liveTile]:o.liveTile};return d`<div class="rm-point-switches" title="One value for every point control tile on this watch.">
    <div class="rm-sub-h"><span>Every room</span></div>
    ${A.pointControl.switches.map(n=>{let r=t[n.key]??n.absent;return qo(n.label,r,r?n.onDetail:n.offDetail,i=>{e.busy||e.write(En(n.key,i))})})}
  </div>`}function Yo(e){if(!e.zones.ok)return"The stored targets cannot be read.";let o=e.zones.rooms.map(([,n])=>n.length).filter(n=>n>0),t=o.reduce((n,r)=>n+r,0);return t===0?"Off in every room.":`${t} ${t===1?"thing":"things"} in ${o.length} ${o.length===1?"room":"rooms"}.`}function Xo(e,o,t){let n=Ke(e,"pointOpen"),r=e.home===!0,i=r?[p.zones]:[p.zones,p.tapToToggle,p.liveTile];return d`<section class="rm-card rm-point" aria-label="Point control">
    <button type="button" class="rm-point-head" aria-expanded=${n?"true":"false"} @click=${()=>Ve(e,"pointOpen",n)}>
      <span class="rm-chev" aria-hidden="true">${x("right")}</span>
      <span class="rm-point-text">
        <span class="rm-point-title">Point control${Ge(Fe(e,i))}</span>
        <span class="rm-point-sub">Point the watch at a lamp to control it. ${Yo(e.view)}</span>
      </span>
    </button>
    ${n?d`<div class="rm-point-body">
      ${t===void 0?d`<p class="rm-help">Add a room first, then the things you point at in it.</p>`:d`<label class="rm-point-room">
            <span>Room</span>
            ${qe("Room for point control",t.key,o.map(a=>[a.key,a.name]),a=>F(e,a),!1)}
          </label>
          ${jo(e,t)}`}
      ${r?m:Zo(e)}
    </div>`:m}
  </section>`}var lo=1.15;function er(e,o,t){let n=e.screen??Ue,r=e.narrow===!0?1:lo,i=io(e,o);if(i!==void 0)return me({page:i,pages:M(e.pagesDocument),screen:n,states:e.hass.states,...e.icons?{icons:e.icons}:{},scale:r,...e.home===!0?{}:{behavior:e.document},...e.appVersion===void 0?{}:{appVersion:e.appVersion}});let a=Ho(e,o);return Ut(n,r,d`<div class="wp-screen rm-screen ${a===""?"blank":""}"
    style=${`width:${n.width*r}px;height:${n.height*r}px;background:${Ft({},r,n)}`}>
    <span>${a===""?t:a}</span>
  </div>`,a===""?"Watch":`Watch showing ${a}`)}function tr(e,o){let t=e.narrow===!0?1:lo;if(o===void 0)return d`<div class="card canvas-card lit rm-canvas" aria-label="Preview">
      <div class="rm-stage-head"><span class="rm-eyebrow">Preview</span><b class="rm-stage-title">No rooms yet</b></div>
      <div class="stage-area rm-stage-area rm-empty">
        <div class="rm-empty-watch" aria-hidden="true">${x("home")}</div>
        <span class="rm-empty-text">Add a room and give it a page. When you walk in, the ${R(e)} opens that page.</span>
      </div>
    </div>`;let n=Q(e.view,o.key),r=e.view.fallback,i=n!==""?n:Ie(r)==="page"?r:"",a=n!==""?"":i!==""?`No page for this room, so the ${R(e)} opens Anywhere else.`:"";return d`<div class="card canvas-card lit rm-canvas" aria-label=${`What the ${R(e)} opens in ${o.name}`}>
    <div class="rm-stage-head">
      <span class="rm-eyebrow">Preview</span>
      <b class="rm-stage-title">${o.name}</b>
      ${a===""?m:d`<span class="rm-stage-note">${a}</span>`}
    </div>
    <div class="stage-area rm-stage-area">
      <div class="rm-stage-body" style=${`--rm-screen-h: ${so(e,t)}px`}>${er(e,i,"No page for this room. The watch uses Anywhere else.")}</div>
    </div>
    <p class="rm-stage-foot">Click a room to see what the ${R(e)} opens there.</p>
  </div>`}function Ze(e){let o=Po(e),t=Io(e,o);return d`<div class="rm-layout" style=${`--wa-stage-hue: ${Xn}; --rm-hue: ${Xn}`}>
    <div class="rm-cell rm-cell-status">${zo(e)}</div>
    <div class="rm-cell rm-cell-rules">${Qo(e,o,t)}</div>
    <aside class="rm-side column canvas" aria-label="Preview">${tr(e,t)}</aside>
    <div class="rm-cell rm-cell-point">${Xo(e,o,t)}</div>
  </div>`}var po=V`
  /* A main column of rules and a sticky stage beside it, the page no wider
     than 1240px, at the left under the device's tabs. Under 1000px one column:
     the stage goes under the rules, before point control, and scrolls with
     the page. */
  .rm-layout {
    width: 100%; max-width: 1240px; margin: 0 0 14px;
    display: grid; grid-template-columns: minmax(0, 1fr) 360px; grid-template-rows: auto auto 1fr;
    column-gap: 16px; row-gap: 14px; align-items: start;
  }
  .rm-cell { min-width: 0; }
  .rm-cell-status { grid-column: 1; grid-row: 1; }
  .rm-cell-rules { grid-column: 1; grid-row: 2; }
  .rm-cell-point { grid-column: 1; grid-row: 3; }
  .rm-side { grid-column: 2; grid-row: 1 / span 3; position: sticky; top: var(--rm-side-top, 12px); min-width: 0; }
  @container (max-width: 1000px) {
    .rm-layout { grid-template-columns: minmax(0, 1fr); grid-template-rows: none; }
    .rm-cell-status, .rm-cell-rules, .rm-cell-point, .rm-side { grid-column: 1; grid-row: auto; }
    .rm-side { position: static; }
  }

  /* Help is one plain line: muted, never italic. */
  .rm-help { margin: 2px 0 8px; font-size: 12px; line-height: 1.45; font-style: normal; color: var(--wa-muted); overflow-wrap: anywhere; }
  .rm-help.warn { color: var(--wa-amber); }
  .rm-help a, .rm-sensor-hint a { color: var(--wa-ink); }
  .rm-help code, .rm-card code { font-family: ui-monospace, SFMono-Regular, Menlo, monospace; }
  .rm-stack .field { grid-template-columns: minmax(0, 1fr); gap: 4px; padding: 2px 0; }
  .rm-stack .field.entity-field > :not(:first-child) { grid-column: 1; }
  .rm-card .field :is(input[type=text], input[type=number], select) {
    height: 30px; min-height: 30px; padding: 0 9px; font-size: 13px; border-radius: 7px;
    border-color: var(--wa-line-strong); background-color: var(--wa-field);
  }
  .rm-card .field.check { grid-template-columns: minmax(0, 1fr) auto; min-height: 30px; padding: 0; font-size: 13px; gap: 10px; }
  .rm-card .field.check > span { color: var(--wa-ink); font-size: 13px; }
  /* A picked entity wraps its name, id and state rather than cutting them
     short; the box grows a line instead. */
  .rm-card .ent-chosen { height: auto; min-height: 28px; }
  .rm-card button.ent-pick { flex-wrap: wrap; row-gap: 0; padding-top: 3px; padding-bottom: 3px; }
  .rm-card .ent-pick :is(.ent-name, .ent-id, .ent-state) { white-space: normal; overflow: visible; text-overflow: clip; overflow-wrap: anywhere; max-width: none; }
  .rm-card .ent-pick .ent-id { flex: 0 1 auto; }
  .rm-dirty { display: inline-block; width: 7px; height: 7px; margin-left: 7px; vertical-align: middle; border-radius: 50%; background: var(--rm-hue); }

  /* The cards: plain, the Rooms hue only on the lit outline of the card at
     the top, the icon chip and the picked row's edge. */
  .rm-card {
    border-radius: var(--wa-lc-r, 16px); background: var(--wa-card); border: 1px solid var(--wa-line); color: var(--wa-ink);
  }
  .rm-card.rm-lit { --c: var(--rm-hue); --lo-fill: var(--wa-card); --lo-mid: var(--wa-card-mid); ${dt} }
  /* The hue stays on the outline: the controls inside are neutral. */
  .rm-card.rm-lit > * { --c: var(--wa-accent); }
  .rm-eyebrow { font-size: 11px; font-weight: 500; letter-spacing: .12em; text-transform: uppercase; color: var(--wa-muted); }
  .rm-start .rm-eyebrow { color: var(--rm-hue); }
  .rm-cap { font-size: 11px; font-weight: 500; letter-spacing: .12em; text-transform: uppercase; color: var(--wa-soft); }
  /* Every button and link button: a visible one pixel outline, neutral. */
  .rm-btn {
    display: inline-flex; align-items: center; justify-content: center; gap: 5px; flex: none;
    height: 32px; padding: 0 12px; border-radius: 8px; font: inherit; font-size: 13px; font-weight: 500; cursor: pointer;
    text-decoration: none; color: var(--wa-ink); background: transparent; border: 1px solid var(--wa-line-strong);
  }
  .rm-btn.rm-small { height: 24px; padding: 0 9px; border-radius: 6px; font-size: 12px; font-weight: 400; color: var(--wa-soft); }
  .rm-btn:hover:not(:disabled) { background: var(--wa-hover); }
  .rm-btn:focus-visible { outline: none; box-shadow: var(--wa-ring); }
  .rm-btn:disabled { opacity: .45; cursor: default; }
  .rm-btn svg.ui-icon { width: 13px; height: 13px; }
  select.rm-select {
    min-width: 0; max-width: 100%; height: 30px; padding: 0 8px; border-radius: 7px; font: inherit; font-size: 13px;
    color: var(--wa-ink); background-color: var(--wa-field); border: 1px solid var(--wa-line-strong); cursor: pointer;
  }
  select.rm-select:focus-visible { outline: none; box-shadow: var(--wa-ring); }
  select.rm-select:disabled { opacity: .45; cursor: default; }

  /* Switching: the chip, the line and the sensor, the switch at the
     right end, When under a hairline. */
  .rm-status {
    display: grid; grid-template-columns: auto minmax(0, 1fr) auto; align-items: center;
    column-gap: 16px; row-gap: 12px; padding: 16px 18px;
  }
  .rm-ichip {
    width: 38px; height: 38px; border-radius: 10px; display: grid; place-items: center;
    border: 1px solid var(--rm-hue); color: var(--rm-hue);
  }
  .rm-ichip svg.ui-icon { width: 18px; height: 18px; stroke-width: 2; }
  .rm-status-text { min-width: 0; display: flex; flex-direction: column; gap: 5px; }
  .rm-now { margin: 0; font-size: 16px; line-height: 1.4; overflow-wrap: anywhere; }
  .rm-now b { font-weight: 600; }
  .rm-sensor-line { display: flex; flex-wrap: wrap; align-items: center; gap: 4px 8px; font-size: 12px; color: var(--wa-muted); }
  .rm-sensor-name, .rm-sensor-hint { overflow-wrap: anywhere; }
  .rm-bermuda-ok { display: inline-flex; align-items: center; gap: 6px; color: var(--wa-green); overflow-wrap: anywhere; }
  .rm-bermuda-ok svg.ui-icon { width: 13px; height: 13px; flex: none; stroke-width: 2.4; }
  .rm-status-switch { min-width: 0; }
  .rm-status > .rm-status-switch { grid-column: 3; grid-row: 1; }
  .rm-status-wide { grid-column: 1 / -1; }
  .rm-status > .rm-help.rm-main-house { margin: 0; }
  .rm-sensor-edit { display: flex; flex-direction: column; gap: 4px; padding-top: 10px; border-top: 1px solid var(--wa-line); }
  .rm-when { display: flex; flex-wrap: wrap; align-items: center; gap: 8px 10px; padding-top: 12px; border-top: 1px solid var(--wa-line); }
  .rm-when-l { font-size: 12px; color: var(--wa-muted); }
  .seg.rm-seg { flex: 0 1 auto; max-width: 100%; height: auto; min-height: 30px; flex-wrap: wrap; }
  .seg.rm-seg button { min-height: 26px; padding: 3px 11px; font-size: 12px; font-weight: 500; letter-spacing: 0; line-height: 1.2; white-space: normal; overflow-wrap: anywhere; text-align: center; }
  .seg.rm-seg button:disabled { opacity: .45; cursor: default; }
  .rm-when-help { flex: 1 1 220px; min-width: 0; font-size: 12px; line-height: 1.4; color: var(--wa-muted); overflow-wrap: anywhere; }
  @container (max-width: 560px) {
    .rm-status { grid-template-columns: auto minmax(0, 1fr); }
    .rm-status > .rm-status-switch { grid-column: 1 / -1; grid-row: auto; }
  }
  .rm-reading { display: flex; align-items: flex-start; gap: 8px; margin: 2px 0; font-size: 12.5px; line-height: 1.45; overflow-wrap: anywhere; }
  .rm-dot { flex: none; width: 8px; height: 8px; margin-top: 5px; border-radius: 50%; background: var(--wa-line-strong); }
  .rm-dot.ok { background: var(--wa-green); }
  .rm-dot.warn { background: var(--wa-amber); }

  /* Start here: no sensor picked yet. */
  .rm-start { display: flex; flex-direction: column; gap: 10px; padding: 18px; }
  .rm-start-title { margin: 0; font-size: 18px; font-weight: 500; letter-spacing: -.015em; text-transform: none; color: var(--wa-ink); overflow-wrap: anywhere; }
  .rm-pitch { margin: 0; max-width: 640px; font-size: 13px; line-height: 1.5; color: var(--wa-soft); overflow-wrap: anywhere; }
  .rm-start-row { display: flex; flex-wrap: wrap; align-items: flex-end; gap: 8px; }
  .rm-start-row > .rm-stack { flex: 1 1 280px; min-width: 0; }
  .rm-start-row > .rm-bermuda-link { margin-bottom: 2px; }
  .rm-start > .rm-help { margin: 0; }
  .rm-start-switch { display: flex; flex-direction: column; gap: 10px; padding-top: 12px; border-top: 1px solid var(--wa-line); }

  /* The rules: a head of two small capitals, the floors, a row per room. */
  .rm-rules { display: flex; flex-direction: column; overflow: hidden; }
  .rm-rules-head { display: flex; align-items: baseline; gap: 10px; padding: 14px 16px 8px; }
  .rm-rules-head > .rm-cap:first-child { flex: 1; }
  .rm-group { display: flex; flex-direction: column; }
  .rm-floor { padding: 8px 16px 4px; font-size: 11.5px; color: var(--wa-faint); overflow-wrap: anywhere; }
  ul.rm-rows { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; }
  .rm-row {
    display: flex; align-items: center; gap: 12px; padding: 8px 10px 8px 16px; cursor: pointer;
    transition: background-color .15s ease;
  }
  li.rm-row:hover { background: var(--wa-hover); }
  li.rm-row.on { background: var(--wa-raise); box-shadow: inset 2px 0 0 var(--rm-hue); }
  /* On the raised and hovered fills the controls' outline is lifted, so it
     stays visible. */
  li.rm-row:is(.on, :hover) :is(select.rm-select, button.rm-row-x) { border-color: color-mix(in srgb, var(--wa-ink) 26%, var(--wa-raise)); }
  .rm-row-room { flex: 1 1 auto; min-width: 0; display: flex; flex-wrap: wrap; align-items: center; gap: 3px 8px; }
  button.rm-row-name {
    padding: 0; border: 0; background: transparent; font: inherit; font-size: 14px; font-weight: 500; text-align: left;
    color: var(--wa-ink); cursor: pointer; overflow-wrap: anywhere; border-radius: 4px;
  }
  button.rm-row-name:focus-visible { outline: none; box-shadow: var(--wa-ring); }
  .rm-row-sub { flex-basis: 100%; font-size: 12px; line-height: 1.35; color: var(--wa-muted); overflow-wrap: anywhere; }
  .rm-arrow { flex: none; display: inline-flex; color: var(--wa-faint); }
  .rm-arrow svg.ui-icon { width: 16px; height: 16px; }
  .rm-row-page { flex: 0 0 260px; min-width: 0; display: flex; align-items: center; gap: 8px; }
  .rm-row-page > select.rm-select { flex: 1 1 auto; }
  .rm-row-end { flex: 0 0 26px; display: flex; justify-content: flex-end; }
  button.rm-row-x {
    width: 26px; height: 26px; padding: 0; display: grid; place-items: center; border-radius: 6px; cursor: pointer;
    color: var(--wa-muted); background: transparent; border: 1px solid var(--wa-line-strong); opacity: 0;
  }
  li.rm-row:hover button.rm-row-x, li.rm-row:focus-within button.rm-row-x, li.rm-row.on button.rm-row-x { opacity: 1; }
  @media (hover: none) { button.rm-row-x { opacity: 1; } }
  button.rm-row-x:hover:not(:disabled) { color: var(--wa-ink); background: var(--wa-hover); }
  button.rm-row-x:focus-visible { outline: none; opacity: 1; box-shadow: var(--wa-ring); }
  button.rm-row-x:disabled { cursor: default; }
  button.rm-row-x svg.ui-icon { width: 12px; height: 12px; }
  .rm-else { margin-top: 6px; padding-top: 12px; padding-bottom: 12px; cursor: default; border-top: 1px solid var(--wa-line); background: var(--wa-panel); }
  .rm-else-name { font-size: 14px; font-weight: 500; }
  /* One screen of the page, small, beside each picker; an empty box when
     there is none. */
  .rm-thumb { flex: none; display: block; width: var(--rm-thumb-w); }
  .rm-thumb .wa-watch { margin: 0; }
  .rm-thumb.empty { height: var(--rm-screen-h); border-radius: 6px; border: 1px dashed var(--wa-line-strong); }
  :is(.rm-stage-body, .rm-thumb) .wa-watch > .wp-screen { max-height: var(--rm-screen-h); }
  :is(.rm-stage-body, .rm-thumb) .wp-fold { display: none; }
  @container (max-width: 640px) {
    .rm-row { flex-wrap: wrap; row-gap: 8px; }
    .rm-row-room { flex-basis: calc(100% - 40px); }
    .rm-arrow { display: none; }
    .rm-row-page { flex: 1 1 auto; }
    .rm-row-end { order: 0; }
    .rm-row > .rm-row-room { order: -1; }
  }
  .rm-none { display: flex; flex-direction: column; gap: 4px; padding: 14px 16px; }
  .rm-none b { font-size: 13px; font-weight: 600; }
  .rm-none span { font-size: 12px; line-height: 1.45; color: var(--wa-muted); }
  /* The fold under the rules: the areas not listed yet and the name field. */
  button.rm-fold {
    display: flex; align-items: center; gap: 8px; width: 100%; padding: 12px 16px; font: inherit; font-size: 12.5px;
    text-align: left; cursor: pointer; color: var(--wa-muted); background: transparent; border: 0; border-top: 1px solid var(--wa-line);
  }
  button.rm-fold:hover { background: var(--wa-hover); color: var(--wa-ink); }
  button.rm-fold:focus-visible { outline: none; box-shadow: var(--wa-ring); }
  .rm-chev { display: inline-flex; flex: none; transition: transform .15s ease; }
  .rm-chev svg.ui-icon { width: 12px; height: 12px; stroke-width: 2.2; }
  [aria-expanded="true"] > .rm-chev { transform: rotate(90deg); }
  .rm-more { display: flex; flex-direction: column; gap: 10px; padding: 0 16px 14px; }
  .rm-areas { display: flex; flex-wrap: wrap; gap: 6px; }
  .rm-areas-help { width: 100%; margin: 2px 0 0; }
  button.rm-area {
    min-height: 26px; padding: 2px 10px; border-radius: 999px; font: inherit; font-size: 12px; cursor: pointer;
    color: var(--wa-soft); background: transparent; border: 1px solid var(--wa-line-strong); overflow-wrap: anywhere; text-align: left;
  }
  button.rm-area:hover { background: var(--wa-hover); color: var(--wa-ink); }
  button.rm-area:focus-visible { outline: none; box-shadow: var(--wa-ring); }
  .rm-add-room { display: flex; gap: 6px; max-width: 480px; }
  .rm-add-room input {
    flex: 1 1 auto; min-width: 0; height: 32px; padding: 0 10px; border-radius: 8px;
    border: 1px solid var(--wa-line-strong); background: var(--wa-field); color: var(--wa-ink); font: inherit; font-size: 13px;
  }
  .rm-add-room input:focus-visible { outline: none; border-color: var(--wa-accent); box-shadow: var(--wa-ring); }
  .rm-more > .rm-help { margin: -4px 0 0; }

  /* Point control, folded: one line, then the picked room's targets and the
     two switches. */
  button.rm-point-head {
    display: flex; align-items: center; gap: 10px; width: 100%; padding: 13px 16px; border-radius: var(--wa-lc-r, 16px);
    font: inherit; text-align: left; cursor: pointer; color: var(--wa-ink); background: transparent; border: 0;
  }
  button.rm-point-head:hover { background: var(--wa-hover); }
  button.rm-point-head:focus-visible { outline: none; box-shadow: var(--wa-ring); }
  button.rm-point-head > .rm-chev { color: var(--wa-muted); }
  .rm-point-text { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 2px; }
  .rm-point-title { font-size: 13.5px; font-weight: 500; }
  .rm-point-sub { font-size: 12px; color: var(--wa-muted); overflow-wrap: anywhere; }
  .rm-point-body { display: flex; flex-direction: column; padding: 2px 16px 14px 38px; }
  @container (max-width: 560px) { .rm-point-body { padding-left: 16px; } }
  .rm-point-room { display: flex; flex-wrap: wrap; align-items: center; gap: 8px; font-size: 12px; color: var(--wa-muted); }
  .rm-point-room > select.rm-select { flex: 0 1 260px; }
  .rm-sub-h { display: flex; align-items: center; gap: 8px; margin: 12px 0 4px; font-size: 12px; color: var(--wa-muted); }
  .rm-sub-h > span { flex: 1; }
  .rm-sub-h button.lc-btn { height: 26px; font-size: 12px; font-weight: 500; border: 1px solid var(--wa-line-strong); background: transparent; }
  .rm-switch { margin-top: 6px; }
  .rm-switch .rm-help { margin: 0 0 4px; }
  .rm-point-switches { margin-top: 8px; padding-top: 2px; border-top: 1px solid var(--wa-line); }
  .rm-target {
    display: grid; grid-template-columns: 64px minmax(0, 1fr) 28px; gap: 10px; align-items: start;
    margin: 8px 0; padding: 10px; border: 1px solid var(--wa-line); border-radius: var(--wa-r-md, 12px); background: var(--wa-field);
  }
  .rm-target-fields { min-width: 0; }
  .rm-dial { width: 64px; height: 64px; touch-action: none; cursor: grab; display: block; border-radius: 50%; }
  .rm-dial:active { cursor: grabbing; }
  .rm-dial:focus-visible { outline: none; box-shadow: var(--wa-ring); }
  .rm-dial-face { fill: var(--wa-card); stroke: var(--wa-line-strong); stroke-width: 1.2; }
  .rm-dial-tick { stroke: var(--wa-muted); stroke-width: 1.2; }
  .rm-dial-n { font-size: 7px; font-weight: 700; fill: var(--wa-muted); text-anchor: middle; }
  .rm-dial-other { fill: var(--wa-muted); opacity: .5; }
  .rm-dial-needle { stroke: var(--wa-ink); stroke-width: 2; stroke-linecap: round; }
  .rm-dial-tip { fill: var(--wa-ink); }
  .rm-dial-hub { fill: var(--wa-ink); }
  .rm-heading-box { display: inline-flex; align-items: center; gap: 6px; }
  .rm-card .rm-heading-box input { width: 72px; }
  .rm-compass { font-size: 12px; color: var(--wa-muted); white-space: nowrap; }
  .rm-remove {
    width: 28px; height: 28px; padding: 0; display: grid; place-items: center; border-radius: 6px;
    border: 1px solid var(--wa-line-strong); background: transparent; color: var(--wa-muted); cursor: pointer;
  }
  .rm-remove:hover:not(:disabled) { background: var(--wa-panel); color: var(--wa-ink); }
  .rm-remove:focus-visible { outline: none; box-shadow: var(--wa-ring); }
  .rm-remove svg.ui-icon { width: 13px; height: 13px; }
  .rm-add-target { margin: 4px 0 8px; }

  /* The stage: the lit card (the watch editors' recipe, its edge in the
     Rooms hue), the picked room over the watch, one line at its foot. */
  .column.canvas.rm-side { gap: 0; }
  .column.canvas > .card.canvas-card.rm-canvas { min-height: 0; flex: none; }
  .rm-stage-head { display: flex; flex-direction: column; gap: 2px; padding: 14px 16px 0; }
  .rm-stage-title { font-size: 16px; font-weight: 500; overflow-wrap: anywhere; }
  .rm-stage-note { font-size: 12px; line-height: 1.4; color: var(--wa-muted); overflow-wrap: anywhere; }
  .canvas-card.lit .stage-area.rm-stage-area { flex: none; align-items: center; justify-content: center; padding: 18px 12px 24px; }
  .canvas-card.lit .stage-area > .rm-stage-body { display: flex; justify-content: center; max-width: 100%; padding-bottom: 32px; }
  .rm-stage-foot { margin: 0; padding: 0 16px 16px; font-size: 12px; line-height: 1.45; color: var(--wa-muted); overflow-wrap: anywhere; }
  /* A plain watch screen: the page's name, or why there is none, on the
     watch's black. */
  .wp-screen.rm-screen { display: grid; place-items: center; padding: 20px; text-align: center; }
  .wp-screen.rm-screen span { font-size: 15px; font-weight: 600; color: var(--wa-face-muted); overflow-wrap: anywhere; }
  .wp-screen.rm-screen.blank span { font-size: 13px; font-weight: 500; line-height: 1.4; }
  /* No rooms yet: a dashed watch and one line. */
  .canvas-card.lit .stage-area.rm-empty { flex-direction: column; gap: 18px; padding: 24px 20px 40px; text-align: center; }
  .rm-empty-watch {
    width: 180px; height: 218px; border-radius: 50px; display: grid; place-items: center;
    border: 1.5px dashed var(--wa-line-strong); color: var(--wa-stage-hue);
  }
  .rm-empty-watch svg.ui-icon { width: 42px; height: 42px; stroke-width: 1.6; }
  .rm-empty-text { max-width: 280px; font-size: 13px; line-height: 1.5; color: var(--wa-muted); }
`;hn({dirty:Je,drop:Zn});typeof window<"u"&&window.addEventListener("beforeunload",e=>{Je()&&(e.preventDefault(),e.returnValue="")});var nr=15e3,or="watch settings",rr="rooms";function ir(e){return`${e}\0rooms`}var ho=typeof navigator<"u"&&/Mac|iPhone|iPad/.test(navigator.platform||navigator.userAgent),Ye=ho?"\u2318":"Ctrl+",ar=820;function sr(e){return _(e).message}function uo(e){return _(e).code}function mo(e){let{code:o,message:t}=_(e);return Object.assign(new Error(t),o===void 0?{}:{code:o})}function dr(e){return e<1e3?`${e} bytes`:`${Number((e/1e3).toFixed(1))} KB`}function cr(e){let o=e?Date.parse(e):NaN;return Number.isNaN(o)?"":st(Math.max(0,(Date.now()-o)/1e3))}function lr(e){return e instanceof HTMLElement?It(e.tagName,e instanceof HTMLInputElement?e.type:void 0,e.isContentEditable):!1}function pr(){let e=document.activeElement;for(;e?.shadowRoot?.activeElement;)e=e.shadowRoot.activeElement;return e===null||e===document.body||e===document.documentElement}var G=new Map,h=class extends tt{constructor(){super(...arguments);this.owners=[];this.narrow=!1;this.haMenu=!1;this.barActions=m;this.shellOwnsWatch=!1;this.phones=!1;this.barHost=void 0;this.iconsTick=0;this.headBar=new Ot(this);this.loading=!1;this.history=[];this.historyState="loading";this.restoring=!1;this.historyOpen=!1;this.rawOpen=!1;this.rawCopied=!1;this.topMenuOpen=!1;this.watchMenuOpen=!1;this.hostWidth=0;this.areas=[];this.areasRead=!1;this.floors=[];this.sensorHistory=[];this.unsupported=!1;this.shownFootDialogs=new WeakSet;this.ownListAsked=!1;this.savedTicker=new Zt(this);this.uiState=new Map;this.reloadPending=!1;this.loadSeq=0;this.historySeq=0;this.sensorSeq=0;this.subscribeSeq=0;this.onReconnect=()=>{let t=this.watchId;!this.isConnected||t===void 0||this.load(t,!0)};this.onKeyDown=t=>{if(t.defaultPrevented)return;let n=t.composedPath();if(!n.includes(this)&&!this.headBar.holds(n)&&!pr()||this.renderRoot.querySelector("dialog[open]"))return;let r=t.metaKey||t.ctrlKey,i=t.key.toLowerCase();if(r&&!t.altKey&&i==="s"){t.preventDefault(),this.save();return}if(t.key==="Escape"&&(this.topMenuOpen||this.watchMenuOpen)){t.preventDefault(),this.topMenuOpen=!1,this.watchMenuOpen=!1;return}if(!lr(n[0])){if(r&&!t.altKey&&i==="z"){t.preventDefault(),t.shiftKey?this.redo():this.undo();return}t.ctrlKey&&!t.metaKey&&!t.altKey&&i==="y"&&(t.preventDefault(),this.redo())}};this.onWindowPointerDown=t=>{if(!this.topMenuOpen&&!this.watchMenuOpen)return;let n=t.composedPath(),r=i=>n.some(a=>a instanceof HTMLElement&&a.classList.contains(i));this.topMenuOpen&&!r("pe-top-menu")&&(this.topMenuOpen=!1),this.watchMenuOpen&&!r("rm-watch-picker")&&(this.watchMenuOpen=!1)}}get watches(){return bt(this.owners.length>0?this.owners:this.ownList??[],this.phones)}get device(){return fn(this.watches,this.watchId)?"iphone":"watch"}get kind(){return this.kindOf(this.watchId)}kindOf(t,n=this.watches){return Jn(t===void 0?void 0:n.find(r=>r.owner_watch_id===t))}get draftKey(){let t=this.watchId;if(t!==void 0)return this.kind==="rooms"?ir(t):t}get draft(){let t=this.record,n=this.draftKey;if(n===void 0||t===void 0)return;if(t.revision<=0)return this.kind==="rooms"&&this.unsupported||!this.opensReady()?void 0:re(n)??Ne(n,this.newWatchBase());let r=He(t);if(r!==void 0)return re(n)??Le(n,r,t.revision).draft}get newWatch(){let t=this.record;return t!==void 0&&t.revision<=0&&!(this.kind==="rooms"&&this.unsupported)}newWatchBase(){return this.kind==="rooms"?Wn():Rt()}opensReady(t=this.watches){let n=this.watchId,r=de(t.find(i=>i.owner_watch_id===n));return sn(r,this.kindOf(n,t),n)}startFresh(){let t=this.watchId;if(t===void 0)return;let n=this.watches.find(r=>r.owner_watch_id===t);!le(n)||!xt(de(n))||(an(this.kind,t),this.note=void 0,this.requestUpdate())}get saving(){return this.draft?.saving??!1}get dirty(){return this.draft?.dirty??!1}connectedCallback(){super.connectedCallback(),this.barHost!==void 0&&this.requestUpdate(),window.addEventListener("keydown",this.onKeyDown),window.addEventListener("pointerdown",this.onWindowPointerDown,!0),this.watchSize(),this.listenForReconnect(),this.watchId!==void 0&&this.openWatch(this.watchId,!0)}disconnectedCallback(){super.disconnectedCallback(),this.headBar.clear(),window.removeEventListener("keydown",this.onKeyDown),window.removeEventListener("pointerdown",this.onWindowPointerDown,!0),this.sizeObserver?.disconnect(),this.stopListeningForReconnect(),this.reloadPending=!1,this.endSubscription(),this.stopPolling(),this.loadSeq++,this.historySeq++,this.sensorSeq++}willUpdate(t){if(this.hass){t.has("hass")&&this.listenForReconnect(),this.owners.length===0&&!this.ownListAsked&&(this.ownListAsked=!0,nt(this.hass).then(a=>{this.ownList=a.owners},()=>{this.ownList=[]}));let r=At(this.watches,this.watchId,this.ownerId,this.shellOwnsWatch||t.has("ownerId"));r!==void 0?this.openWatch(r):this.watchId!==void 0&&this.shownKind!==void 0&&this.kind!==this.shownKind&&this.openWatch(this.watchId),this.areasAsked!==this.hass.connection&&this.loadAreas();let i=this.currentSensor();i!==this.sensorHistoryFor&&this.loadSensorHistory(i)}let n=this.restoreAsk;n!==void 0&&!this.restoring&&this.historyState==="ready"&&!this.history.some(r=>r.revision===n.entry.revision)&&this.closeAsk()}updated(){this.headBar.draw(this.barHost,()=>this.renderTopBar(this.draft,this.watches));let t=this.renderRoot.querySelector("dialog.pe-ask")??void 0;t!==this.shownDialog&&(this.shownDialog=t,t&&!t.open&&t.showModal()),tn(this.renderRoot,this.shownFootDialogs),this.savedTicker.show(this.headBar.query(this.renderRoot,".cf-saved")!==null||this.renderRoot.querySelector(".cf-saved")!==null)}watchSize(){typeof ResizeObserver>"u"||(this.sizeObserver??=new ResizeObserver(t=>{for(let n of t){let r=n.contentRect.width;Math.abs(r-this.hostWidth)>=1&&(this.hostWidth=r)}}),this.sizeObserver.observe(this))}listenForReconnect(){let t=this.hass?.connection;t!==this.readyConnection&&(this.stopListeningForReconnect(),!(!this.isConnected||typeof t?.addEventListener!="function")&&(t.addEventListener("ready",this.onReconnect),this.readyConnection=t))}stopListeningForReconnect(){this.readyConnection?.removeEventListener?.("ready",this.onReconnect),this.readyConnection=void 0}openWatch(t,n=!1){let r=this.kindOf(t);(t!==this.watchId||r!==this.shownKind)&&(this.reloadPending=!1,this.watchId=t,this.note=void 0,this.history=[],this.pagesRecord=void 0,this.historyState!=="unsupported"&&(this.historyState="loading"),this.closeAsk(),this.uiState.clear(),this.unsupported=!1,n=!1),this.shownKind=r,this.startSubscription(t),this.load(t,n),this.loadPages(t)}async load(t,n=!1){let r=this.hass;if(!r)return;if(n&&this.saving){this.reloadPending=!0;return}let i=++this.loadSeq;this.stopPolling(),n||(this.record=void 0,this.loading=!0,this.loadError=void 0);let a=this.kind;try{let s=await P(r,t,a);if(i!==this.loadSeq)return;if(n&&this.saving){this.reloadPending=!0;return}this.unsupported=!1,this.show(s),this.loadError=void 0}catch(s){if(i!==this.loadSeq)return;a==="rooms"&&Un(s)?(this.unsupported=!0,this.loadError=void 0):n||(this.loadError=sr(s))}this.loading=!1,!this.unsupported&&(this.pollIfWaiting(),this.loadHistory(t))}show(t){let n=this.draftKey;this.record=t,n!==void 0&&t.revision<=0&&Ne(n,this.newWatchBase());let r=He(t);if(n===void 0||r===void 0)return;Le(n,r,t.revision).mergedIntoEdits&&(this.note={kind:"warn",text:`${this.kind==="rooms"?"This home's rooms":"The watch's settings"} changed elsewhere. Your edits are kept on top.`}),this.requestUpdate()}async loadPages(t){let n=this.hass;if(n)try{let r=await P(n,t,"pages");t===this.watchId&&(this.pagesRecord=r)}catch{}}async loadHistory(t){let n=this.hass;if(!n||this.historyState==="unsupported")return;let r=++this.historySeq;try{let i=await rt(n,t,this.kind);if(r!==this.historySeq||t!==this.watchId)return;this.history=Array.isArray(i?.entries)?i.entries:[],this.historyState="ready"}catch(i){if(r!==this.historySeq||t!==this.watchId)return;this.historyState=uo(i)==="unknown_command"?"unsupported":"error"}}async loadAreas(){let t=this.hass;if(!t)return;this.areasAsked=t.connection;let[n,r]=await Promise.allSettled([t.connection.sendMessagePromise({type:"config/area_registry/list"}),t.connection.sendMessagePromise({type:"config/floor_registry/list"})]);this.areas=n.status==="fulfilled"?_n(n.value):On(t.areas);let i=r.status==="fulfilled"?_e(r.value):[];this.floors=i.length>0?i:_e(t.floors),this.areasRead=!0}async loadSensorHistory(t){let n=this.hass;this.sensorHistoryFor=t;let r=++this.sensorSeq;if(this.sensorHistory=[],!(!n||t===""))try{let i=await n.connection.sendMessagePromise({type:"history/history_during_period",start_time:new Date(Date.now()-Pn*36e5).toISOString(),entity_ids:[t],minimal_response:!0,no_attributes:!0,significant_changes_only:!1});if(r!==this.sensorSeq)return;this.sensorHistory=Hn(i,t)}catch{}}startSubscription(t){let n=this.hass;if(this.endSubscription(),!n)return;let r=++this.subscribeSeq;at(n,t,i=>{r===this.subscribeSeq&&(i.kind===this.kind&&i.revision!==(this.record?.revision??0)&&this.load(t,!0),i.kind==="pages"&&i.revision!==(this.pagesRecord?.revision??0)&&this.loadPages(t))}).then(i=>{r===this.subscribeSeq?this.unsubscribe=i:i().catch(()=>{})},()=>{})}endSubscription(){this.subscribeSeq++;let t=this.unsubscribe;this.unsubscribe=void 0,t?.().catch(()=>{})}pollIfWaiting(){this.stopPolling(),!(!this.isConnected||ht(this.record)!=="waiting")&&(this.pollTimer=window.setTimeout(()=>{this.poll()},nr))}async poll(){this.pollTimer=void 0;let t=this.hass,n=this.watchId,r=this.record;if(!(!t||n===void 0||r===void 0)){if(this.saving){this.pollIfWaiting();return}try{let i=await P(t,n,this.kind);if(n!==this.watchId||this.record!==r)return;i.revision===r.revision?this.record={...r,delivered_revision:i.delivered_revision,delivered_at:i.delivered_at,rejected_revision:i.rejected_revision,rejected_at:i.rejected_at,rejected_reason:i.rejected_reason}:this.saving?this.reloadPending=!0:(this.show(i),this.loadHistory(n))}catch{}this.pollIfWaiting()}}stopPolling(){this.pollTimer!==void 0&&window.clearTimeout(this.pollTimer),this.pollTimer=void 0}currentSensor(){let t=this.draft;return t===void 0?"":te(t.effective).sensor}memoIcons(){let t=this.icons??Mt,n=this.iconMemo;if(n!==void 0&&n.provider===t&&n.tick===this.iconsTick)return n.icons;let r=Ct(t);return this.iconMemo={provider:t,tick:this.iconsTick,icons:r},r}screen(){let t=this.watches.find(n=>n.owner_watch_id===this.watchId);return(Nt(t?.screen_size)??Lt).screen}viewHost(){let t=this.draft,n=this.hass,r=this.watchId;if(t===void 0||n===void 0||r===void 0)return;let i=t.effective,a=te(i),s=G.get(r)??[],c=this.kind==="rooms",l=Dn({areas:this.areas,mappingKeys:Object.keys(a.mappings),zoneKeys:a.zones.ok?a.zones.rooms.map(([u])=>u):[],history:this.sensorHistory,added:s});return{hass:n,document:i,view:a,dirty:new Set(W(t.document,t.pending)),pages:$n(pe(this.pagesRecord?.document)),rooms:l,floors:this.floors,roomsState:this.areasRead?"ready":"loading",busy:t.saving,uiState:this.uiState,write:(u,b)=>{this.draft===t&&(t.apply(c?Ce(u):u,b),this.requestUpdate())},endCoalesce:()=>t.endCoalesce(),addRoom:u=>{let b=G.get(r)??[];b.includes(u)||G.set(r,[...b,u]),this.requestUpdate()},added:s,forgetRoom:u=>{let b=G.get(r)??[];G.set(r,b.filter(g=>y(g)!==u))},pagesDocument:pe(this.pagesRecord?.document),screen:this.screen(),appVersion:this.watches.find(u=>u.owner_watch_id===r)?.app_version,icons:this.memoIcons(),narrow:this.stacked,requestUpdate:()=>this.requestUpdate(),...c?{home:!0}:{},...this.watches.find(u=>u.owner_watch_id===r)?.device_kind==="iphone"?{phone:!0}:{}}}undo(){this.draft?.undo()&&this.requestUpdate()}redo(){this.draft?.redo()&&this.requestUpdate()}discard(){this.saving||this.draft?.discard()&&(this.note={kind:"ok",text:"Edits discarded. Undo brings them back."},this.requestUpdate())}async save(){let t=this.hass,n=this.watchId,r=this.draft,i=this.record;if(!t||n===void 0||!r||!i||r.saving||!r.dirty)return;this.note=void 0,r.endCoalesce();let a=this.kind,s=r.revision<=0;if(s&&!St(this.watches.find(u=>u.owner_watch_id===n),[a]))return;let c=Yn(r,{save:(u,b)=>ot(t,n,a,u,b).catch(g=>{throw mo(g)}),fetch:()=>P(t,n,a).catch(u=>{throw mo(u)})});this.requestUpdate();let l=await c;if(n===this.watchId){if(l.ok){let u=l.fresh??i;this.record=l.alreadySaved?u:{...u,revision:l.revision,updated_at:new Date().toISOString(),updated_by:"panel",document:l.document}}else l.fresh!==void 0&&(this.record=l.fresh);this.note=cn(s,l.ok?void 0:l.code,Nn(l,a)),this.reloadPending?(this.reloadPending=!1,this.load(n,!0)):(this.pollIfWaiting(),this.loadHistory(n)),this.requestUpdate()}}closeAsk(){this.renderRoot?.querySelector("dialog.pe-ask")?.close(),this.restoreAsk=void 0}askRestore(t){let n=this.record;this.watchId===void 0||n===void 0||this.dirty||(this.restoreAsk={entry:t,baseRevision:n.revision})}async restore(){let t=this.hass,n=this.watchId,r=this.restoreAsk;if(!t||n===void 0||r===void 0||this.restoring)return;this.restoring=!0;let i=this.kind==="rooms",a=this.draftKey??n,s;try{await it(t,n,this.kind,r.entry.revision,r.baseRevision),s={kind:"ok",text:rn(r.entry.updated_at)},(re(a)?.dirty??!1)||qn(a)}catch(c){let l=uo(c);l==="conflict"?s={kind:"warn",text:`Not restored. ${i?"This home's rooms":"The watch's settings"} changed somewhere else, so the newest copy is shown.`}:l==="no_record"?s={kind:"warn",text:i?"Not restored. Home Assistant no longer holds rooms for this home.":"Not restored. Home Assistant no longer holds settings for this watch."}:l==="not_found"?s={kind:"warn",text:"Not restored. That save is no longer kept."}:l==="unknown_command"?(this.historyState="unsupported",s={kind:"warn",text:"This version of the integration cannot restore an earlier save. Update it to restore one."}):s={kind:"err",text:`Could not restore: ${Jt(c)}`}}finally{this.restoring=!1,this.restoreAsk===r&&this.closeAsk()}n===this.watchId&&(this.note=s,this.load(n,!0))}render(){let t=this.watches,n=this.draft;return d`
      <div class="pe-top">
        ${this.barHost===void 0?this.renderTopBar(n,t):m}
        ${this.note?d`<div class="pe-note ${this.note.kind}" role="status"><span>${this.note.text}</span>
          <button class="pe-link" @click=${()=>{this.note=void 0}}>Dismiss</button></div>`:m}
      </div>
      ${this.renderBody(t)}
      ${this.restoreAsk?this.renderRestoreAsk(this.restoreAsk):m}
    `}get stacked(){return this.narrow||this.hostWidth>0&&this.hostWidth<=ar}renderTopBar(t,n){let r=t!==void 0,i=r&&this.dirty;return d`<div class="wa-bar ${this.barHost!==void 0?"in-head":this.stacked?"stacked":""}" role="toolbar" aria-label="Watch rooms">
      ${this.haMenu?d`<button class="icon tb-icon tb-menu" title="Home Assistant menu" aria-label="Home Assistant menu"
        @click=${()=>this.onHaMenu?.()}>${x("menu")}</button>`:m}
      ${this.shellOwnsWatch?m:d`<button class="tb-btn tb-back" title="Back to complications"
        @click=${()=>this.onBack?this.onBack():mn(void 0,!1)}>${x("left")}<span>Complications</span></button>`}
      ${this.barHost===void 0?d`<span class="rm-title">Rooms</span>`:m}
      <span class="spacer"></span>
      ${this.shellOwnsWatch?m:this.renderWatchPicker(n)}
      ${this.barHost!==void 0&&r?Ht({newWatch:this.newWatch,dirty:i,saved:fe(this.record,void 0,this.device),device:this.device,newWords:kt(this.watches.find(a=>a.owner_watch_id===this.watchId),this.kind)}):m}
      ${this.renderSyncPill(t)}
      ${r?d`
        <button class="tb-btn icon rm-undo" ?disabled=${!t.canUndo||this.saving} title=${`Undo (${Ye}Z)`} aria-label="Undo"
          @click=${()=>this.undo()}>${x("undo")}</button>
        <button class="tb-btn icon rm-undo" ?disabled=${!t.canRedo||this.saving} title=${ho?"Redo (\u21E7\u2318Z)":"Redo (Ctrl+Y)"} aria-label="Redo"
          @click=${()=>this.redo()}>${x("redo")}</button>`:m}
      ${this.renderTopMenu(t)}
      ${r?d`<button class="primary save ${i?"dirty":""}" ?disabled=${!i||this.saving}
          title=${i?`Save (${Ye}S). A save reaches the ${wt(this.device)} the next time it checks.`:`Nothing to save (${Ye}S)`}
          @click=${()=>{this.save()}}>${this.saving?"Saving\u2026":"Save"}</button>
        ${this.barHost!==void 0?m:d`<span class="tb-saved" title=${i?"Unsaved changes":""}>${fe(this.record,void 0,this.device)}</span>
        ${pn(dn({newWatch:this.newWatch,dirty:i,saving:this.saving}))}`}`:m}
      ${this.barActions}
    </div>`}get noun(){return this.kind==="rooms"?rr:or}renderSyncPill(t){let n=this.record;if(n===void 0||n.revision<=0||t===void 0)return m;let r=Oe(t.effective,this.kind),i=he({record:n,size:r.size,limit:r.limit,noun:this.noun,historyState:this.historyState,device:this.device});return Vt(i,t.dirty,this.barHost!==void 0)}renderTopMenu(t){if(t===void 0)return m;let n=this.topMenuOpen,r=i=>()=>{this.topMenuOpen=!1,i()};return d`<span class="side-menu pe-top-menu">
      <button class="tb-btn tb-more" aria-haspopup="menu" aria-expanded=${n?"true":"false"} aria-label="More actions" title="More"
        @click=${()=>{this.topMenuOpen=!n}}>···</button>
      ${n?d`<div class="pop-menu side-pop" role="menu" aria-label="More actions">
        <button class="row" role="menuitem" ?disabled=${!this.dirty||this.saving}
          title=${this.newWatch?"Go back to how the screen opened. Undo brings the edits back.":"Go back to the copy Home Assistant holds. Undo brings the edits back."}
          @click=${r(()=>this.discard())}>Discard edits</button>
        ${(this.record?.revision??0)>0?jt(r(()=>{this.rawCopied=!1,this.rawOpen=!0})):m}
      </div>`:m}
    </span>`}colorOf(t){return Wt(Bt(this.owners.length>0?this.owners:this.ownList??[]),t)}renderWatchPicker(t){if(t.length<2)return m;let n=t.find(a=>a.owner_watch_id===this.watchId),r=this.watchMenuOpen,i=a=>{let s=a===void 0?void 0:this.colorOf(a);return d`<span class="pe-chip-glyph" style=${s?`--pe-person: ${s}`:m} aria-hidden="true">${x("watch")}</span>`};return d`<span class="picker rm-watch-picker">
      <button type="button" class="tb-browse rm-watch-btn" aria-haspopup="menu" aria-expanded=${r?"true":"false"}
        title="Choose the watch whose rooms are shown" @click=${()=>{this.watchMenuOpen=!r}}>
        ${i(n?.owner_watch_id)}<span class="tb-browse-l">${n?se(n,t):"Choose a watch"}</span>
        <span class="rm-caret" aria-hidden="true">${x("chevron")}</span>
      </button>
      ${r?d`<div class="pop-menu rm-watch-menu" role="menu" aria-label="Watches">
        ${t.map(a=>{let s=a.owner_watch_id===this.watchId;return d`<button type="button" class="row rm-watch-row" role="menuitemradio" aria-checked=${s?"true":"false"}
            @click=${()=>{this.watchMenuOpen=!1,s||this.openWatch(a.owner_watch_id)}}>
            ${i(a.owner_watch_id)}<span class="rm-watch-name">${se(a,t)}</span>
            <span class="rm-watch-check" aria-hidden="true">${s?x("check"):m}</span>
          </button>`})}
      </div>`:m}
    </span>`}renderBody(t){if(t.length===0){let s=this.owners.length===0&&this.ownList===void 0;return d`<div class="pe-empty">${s?"Loading\u2026":"No watch has connected to this Home Assistant yet. Pair one on the Devices tab."}</div>`}let n=this.kindOf(this.watchId,t)==="rooms";if(n&&this.unsupported)return d`<div class="pe-empty"><b>${Kn}</b></div>`;if(this.loading)return d`<div class="pe-empty">Loading…</div>`;if(this.loadError!==void 0){let s=this.watchId;return d`<div class="pe-empty">
        <span>Could not read this ${n?"home's rooms":"watch's settings"}: ${this.loadError}</span>
        ${s===void 0?m:d`<button class="pe-btn" @click=${()=>{this.load(s)}}>Try again</button>`}
      </div>`}let r=this.record;if(r===void 0)return d`<div class="pe-empty">Loading…</div>`;if(r.revision<=0&&!this.opensReady(t)){let s=t.find(c=>c.owner_watch_id===this.watchId);return d`<div class="pe-empty"><b>${this.device==="iphone"?gt("rooms","iphone"):n?Gn:In}</b>
        <span>${n?j(s?.app_version,ce(s)):Pe(s?.app_version,ce(s))}</span>
        ${le(s)?d`<button class="link start-fresh" @click=${()=>this.startFresh()}>${yt}</button>`:m}
        ${Kt(this.hass,s)}
      </div>`}let i=this.draft,a=this.viewHost();return i===void 0||a===void 0?d`<div class="pe-empty"><b>${n?Vn:Cn}</b></div>`:r.revision<=0?d`${this.barHost===void 0?ln(this.device):m}${Ze(a)}`:d`${Ze(a)}${this.renderFoot(r,i)}`}renderFoot(t,n){let r=n.effective,i=Oe(r,this.kind),a=this.noun,s=he({record:t,size:i.size,limit:i.limit,noun:a,historyState:this.historyState,device:this.device}),c=this.watchId;return d`${Yt({status:s,historyState:this.historyState,historyOpen:this.historyOpen,onHistory:()=>{this.historyOpen=!0}})}
    ${this.historyOpen?Xt({noun:a,device:this.device,record:t,entries:this.history,historyState:this.historyState,dirty:n.dirty,restoring:this.restoring,onRetry:()=>{c!==void 0&&(this.historyState="loading",this.loadHistory(c))},onRestore:l=>{this.historyOpen=!1,this.askRestore(l)},onClosed:()=>{this.historyOpen=!1}}):m}
    ${this.rawOpen?en({noun:a,document:r,revision:t.revision,dirty:n.dirty,copied:this.rawCopied,onCopy:l=>{nn(l).then(u=>{this.rawCopied=u})},onClosed:()=>{this.rawOpen=!1}}):m}`}renderRestoreAsk(t){let n=this.record,r=cr(t.entry.updated_at);return d`<dialog class="pe-ask" aria-labelledby="rm-ask-title"
      @cancel=${i=>{this.restoring&&i.preventDefault()}}
      @close=${()=>{this.restoreAsk=void 0}}>
      <h3 id="rm-ask-title" title=${`Revision ${t.entry.revision}`}>${qt(t.entry)}</h3>
      <p>${ft(t.entry.updated_by,this.device)}${r?` ${r}`:""}, ${dr(t.entry.size)}.</p>
      <p>${this.kind==="rooms"?"This home's rooms come back as they were in that save.":"Every watch setting comes back as it was in that save, not only the rooms."} It is saved again as the newest save, and the copy shown now stays in the earlier saves.</p>
      <div class="pe-ask-foot">
        <button class="pe-btn" ?disabled=${this.restoring} @click=${()=>this.closeAsk()}>Cancel</button>
        <button class="pe-btn pe-primary" ?disabled=${this.restoring} @click=${()=>{this.restore()}}>${this.restoring?"Restoring\u2026":"Restore"}</button>
      </div>
    </dialog>`}static{this.styles=[Tt,ct,lt,pt,ut,mt,Qt,Gt,un,V`
    :host {
      display: flex;
      flex-direction: column;
      flex: 1 1 auto;
      min-height: 0;
      overflow: auto;
      container-type: inline-size;
      --cf-pad: 16px;
      padding: var(--cf-pad);
      color: var(--wa-ink);
      background: var(--wa-bg);
      font-size: 14px;
    }
    * { box-sizing: border-box; }
    svg.ui-icon { width: 14px; height: 14px; display: block; flex: none; }
    h2, h3, h4, p { margin: 0; }
    .pe-top {
      flex: none; display: flex; flex-direction: column;
      position: sticky; top: calc(-1 * var(--cf-pad, 16px)); z-index: 7;
      margin: calc(-1 * var(--cf-pad, 16px)) calc(-1 * var(--cf-pad, 16px)) 0;
      padding: 0 0 10px;
      background: var(--wa-bg);
    }
    h3 { font-size: 13px; font-weight: 650; text-transform: uppercase; letter-spacing: .04em; color: var(--wa-muted); }
    code { font-family: monospace; font-size: 12px; overflow-wrap: anywhere; }
    .pe-muted { color: var(--wa-muted); font-size: 13px; }
    .pe-warn { color: var(--wa-amber); font-size: 13px; font-weight: 600; }
    .rm-title { font-size: 14px; font-weight: 600; letter-spacing: -.01em; padding: 0 4px; white-space: nowrap; }
    .wa-bar button.tb-btn:has(> svg.ui-icon) { display: inline-flex; align-items: center; gap: 6px; padding: 0 11px 0 9px; }
    .wa-bar button.tb-btn.icon { padding: 0 8px; }
    .wa-bar button.tb-btn svg.ui-icon { width: 14px; height: 14px; }
    .wa-bar button.tb-btn:disabled, .wa-bar button.primary.save:disabled { opacity: .45; cursor: default; }
    .wa-bar .tb-saved .cf-saved { margin: 0; font-size: inherit; color: inherit; }
    .wa-bar .pop-menu .row:disabled { opacity: .5; cursor: default; }
    .wa-bar .pop-menu .row:disabled:hover { background: transparent; }
    .pe-top > .pe-note { margin: 10px var(--cf-pad, 16px) 0; }
    .pe-note {
      display: flex; align-items: center; gap: 10px; margin-bottom: 12px; padding: 10px 12px;
      border-radius: var(--wa-r-md, 12px); border: 1px solid var(--wa-line); background: var(--wa-card); font-size: 13px;
    }
    .pe-note > span { flex: 1; min-width: 0; }
    .pe-note.ok { border-color: color-mix(in srgb, var(--wa-green) 40%, transparent); }
    .pe-note.warn { border-color: var(--wa-amber-line); background: var(--wa-amber-bg); }
    .pe-note.err { border-color: color-mix(in srgb, var(--wa-need) 45%, transparent); }
    .pe-link { border: 0; background: none; padding: 0; color: var(--wa-accent); font: inherit; font-size: 13px; cursor: pointer; }
    .pe-link:focus-visible { outline: none; box-shadow: var(--wa-ring); border-radius: 4px; }
    .pe-empty {
      display: flex; flex-direction: column; align-items: flex-start; gap: 8px; max-width: 560px;
      padding: 20px; border: 1px solid var(--wa-line); border-radius: var(--wa-r-lg, 16px); background: var(--wa-card);
    }
    .pe-chip-glyph { display: inline-flex; flex: none; color: var(--pe-person, var(--wa-muted)); }
    .pe-chip-glyph svg.ui-icon { width: 13px; height: 13px; }
    .picker > button.rm-watch-btn { max-width: 260px; }
    .rm-watch-btn .tb-browse-l { min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .rm-watch-btn .rm-caret { display: inline-flex; flex: none; color: var(--wa-muted); }
    .picker > button.rm-watch-btn .rm-caret svg { width: 11px; height: 11px; }
    .pop-menu.rm-watch-menu { left: 0; right: auto; min-width: 220px; }
    .rm-watch-menu .row.rm-watch-row { display: flex; align-items: center; gap: 8px; }
    .rm-watch-row .rm-watch-name { flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; }
    .rm-watch-row[aria-checked="true"] { font-weight: 700; }
    .rm-watch-check { display: inline-flex; flex: none; width: 14px; color: var(--wa-accent); }
    .rm-watch-check svg.ui-icon { width: 14px; height: 14px; }
    .pe-history { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; }
    .pe-history > li { display: flex; align-items: center; gap: 10px; padding: 8px 0; border-top: 1px solid var(--wa-line); }
    .pe-history > li:first-child { border-top: 0; }
    .pe-h-text { display: flex; flex-direction: column; gap: 2px; flex: 1; min-width: 0; }
    .pe-h-text > .pe-muted { font-size: 12px; }
    .pe-btn {
      display: inline-flex; align-items: center; justify-content: center; gap: 6px;
      flex: none; min-height: 32px; padding: 0 12px; border: 1px solid var(--wa-line-strong); border-radius: var(--wa-r-sm, 8px);
      background: var(--wa-card); color: var(--wa-ink); font: inherit; font-size: 13px; cursor: pointer;
    }
    .pe-btn:hover:not(:disabled) { background: var(--wa-panel); }
    .pe-btn:focus-visible { outline: none; box-shadow: var(--wa-ring); }
    .pe-btn:disabled { opacity: .55; cursor: default; }
    .pe-btn.pe-primary { border-color: transparent; background: var(--wa-primary-bg); color: var(--wa-primary-ink); }
    .pe-btn.pe-primary:hover:not(:disabled) { background: var(--wa-primary-bg); filter: brightness(1.1); }
    dialog.pe-ask {
      width: min(460px, calc(100vw - 32px)); padding: 20px; border: 1px solid var(--wa-line); border-radius: var(--wa-r-lg, 16px);
      background: var(--wa-card); color: var(--wa-ink); box-shadow: var(--wa-shadow-pop);
    }
    dialog.pe-ask::backdrop { background: rgba(0, 0, 0, .45); }
    dialog.pe-ask > * + * { margin-top: 10px; }
    dialog.pe-ask h3 { font-size: 17px; text-transform: none; letter-spacing: 0; color: var(--wa-ink); overflow-wrap: anywhere; }
    dialog.pe-ask p { font-size: 14px; line-height: 1.4; }
    .pe-ask-foot { display: flex; justify-content: flex-end; gap: 8px; padding-top: 6px; }
    :host([narrow]) { --cf-pad: 12px; }
  `,po,on,Pt]}};f([S({attribute:!1})],h.prototype,"hass",2),f([S({attribute:!1})],h.prototype,"owners",2),f([S({attribute:!1})],h.prototype,"ownerId",2),f([S({type:Boolean,reflect:!0})],h.prototype,"narrow",2),f([S({attribute:!1})],h.prototype,"haMenu",2),f([S({attribute:!1})],h.prototype,"onHaMenu",2),f([S({attribute:!1})],h.prototype,"onBack",2),f([S({attribute:!1})],h.prototype,"barActions",2),f([S({attribute:!1})],h.prototype,"shellOwnsWatch",2),f([S({attribute:!1})],h.prototype,"phones",2),f([S({attribute:!1})],h.prototype,"barHost",2),f([S({attribute:!1})],h.prototype,"icons",2),f([S({attribute:!1})],h.prototype,"iconsTick",2),f([w()],h.prototype,"watchId",2),f([w()],h.prototype,"record",2),f([w()],h.prototype,"pagesRecord",2),f([w()],h.prototype,"loading",2),f([w()],h.prototype,"loadError",2),f([w()],h.prototype,"history",2),f([w()],h.prototype,"historyState",2),f([w()],h.prototype,"note",2),f([w()],h.prototype,"restoreAsk",2),f([w()],h.prototype,"restoring",2),f([w()],h.prototype,"historyOpen",2),f([w()],h.prototype,"rawOpen",2),f([w()],h.prototype,"rawCopied",2),f([w()],h.prototype,"ownList",2),f([w()],h.prototype,"topMenuOpen",2),f([w()],h.prototype,"watchMenuOpen",2),f([w()],h.prototype,"hostWidth",2),f([w()],h.prototype,"areas",2),f([w()],h.prototype,"areasRead",2),f([w()],h.prototype,"floors",2),f([w()],h.prototype,"sensorHistory",2),f([w()],h.prototype,"sensorHistoryFor",2),f([w()],h.prototype,"unsupported",2);customElements.get("wa-rooms-editor")||customElements.define("wa-rooms-editor",h);export{h as WaRoomsEditor};
