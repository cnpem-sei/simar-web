(function(e){function t(t){for(var r,i,o=t[0],c=t[1],u=t[2],d=0,v=[];d<o.length;d++)i=o[d],Object.prototype.hasOwnProperty.call(s,i)&&s[i]&&v.push(s[i][0]),s[i]=0;for(r in c)Object.prototype.hasOwnProperty.call(c,r)&&(e[r]=c[r]);l&&l(t);while(v.length)v.shift()();return a.push.apply(a,u||[]),n()}function n(){for(var e,t=0;t<a.length;t++){for(var n=a[t],r=!0,o=1;o<n.length;o++){var c=n[o];0!==s[c]&&(r=!1)}r&&(a.splice(t--,1),e=i(i.s=n[0]))}return e}var r={},s={app:0},a=[];function i(t){if(r[t])return r[t].exports;var n=r[t]={i:t,l:!1,exports:{}};return e[t].call(n.exports,n,n.exports,i),n.l=!0,n.exports}i.m=e,i.c=r,i.d=function(e,t,n){i.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:n})},i.r=function(e){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},i.t=function(e,t){if(1&t&&(e=i(e)),8&t)return e;if(4&t&&"object"===typeof e&&e&&e.__esModule)return e;var n=Object.create(null);if(i.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var r in e)i.d(n,r,function(t){return e[t]}.bind(null,r));return n},i.n=function(e){var t=e&&e.__esModule?function(){return e["default"]}:function(){return e};return i.d(t,"a",t),t},i.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},i.p="/";var o=window["webpackJsonp"]=window["webpackJsonp"]||[],c=o.push.bind(o);o.push=t,o=o.slice();for(var u=0;u<o.length;u++)t(o[u]);var l=c;a.push([0,"chunk-vendors"]),n()})({0:function(e,t,n){e.exports=n("56d7")},"336c":function(e,t,n){e.exports=n.p+"img/back.ab239617.png"},"344b":function(e,t,n){"use strict";n("6aad")},"56d7":function(e,t,n){"use strict";n.r(t);n("e260"),n("e6cf"),n("cca6"),n("a79d");var r=n("2b0e"),s=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("v-app",[n("v-main",{attrs:{fluid:""}},[n("toolbar",{attrs:{settings:e.settings},on:{sort:e.updateSort,desc:e.updateDesc,view:e.updateView,search:e.updateSearch}}),n("iterator",{attrs:{settings:e.settings}})],1),n("ft")],1)},a=[],i=(n("ac1f"),n("841c"),function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("v-container",{attrs:{fluid:""}},[n("v-data-iterator",{directives:[{name:"show",rawName:"v-show",value:this.settings.viewMode,expression:"this.settings.viewMode"}],attrs:{items:e.items,"items-per-page":e.itemsPerPage,page:e.page,search:this.settings.search,"sort-by":this.settings.sortBy,"sort-desc":this.settings.sortDesc,"hide-default-footer":""},on:{"update:itemsPerPage":function(t){e.itemsPerPage=t},"update:items-per-page":function(t){e.itemsPerPage=t},"update:page":function(t){e.page=t}},scopedSlots:e._u([{key:"default",fn:function(t){return[n("v-row",e._l(t.items,(function(t){return n("v-col",{key:t.name,attrs:{cols:"12",sm:"6",md:"4",lg:"3"}},[n("v-card",[n("v-card-title",{staticClass:"subheading font-weight-bold"},[e._v(" "+e._s(t.name)+" ")]),n("v-divider"),n("v-list",{attrs:{dense:""}},e._l(e.filteredKeys,(function(r,s){return n("v-list-item",{key:s},[n("v-list-item-content",[e._v(" "+e._s(r)+": ")]),n("v-chip",{staticClass:"align-end",attrs:{color:e.get_pv_color(t,r),"text-color":"white"}},[e._v(" "+e._s(t[r.toLowerCase()])+" ")])],1)})),1)],1)],1)})),1)]}},{key:"footer",fn:function(){return[n("v-row",{staticClass:"mt-2 no-margin",attrs:{align:"center",justify:"center"}},[n("span",{staticClass:"white--text"},[e._v("Items per page")]),n("v-menu",{attrs:{"offset-y":""},scopedSlots:e._u([{key:"activator",fn:function(t){var r=t.on,s=t.attrs;return[n("v-btn",e._g(e._b({staticClass:"ml-2 blue-background",attrs:{dark:"",text:"",color:"white"}},"v-btn",s,!1),r),[e._v(" "+e._s(e.itemsPerPage)+" "),n("v-icon",[e._v("mdi-chevron-down")])],1)]}}])},[n("v-list",e._l([8,12,16,20],(function(t,r){return n("v-list-item",{key:r,on:{click:function(n){return e.updateItemsPerPage(t)}}},[n("v-list-item-title",[e._v(e._s(t))])],1)})),1)],1),n("v-spacer"),n("span",{staticClass:"mr-4 white--text"},[e._v(" Page "+e._s(e.page)+" of "+e._s(e.numberOfPages)+" ")]),n("v-btn",{staticClass:"mr-1",attrs:{dark:"",color:"blue darken-3"},on:{click:e.formerPage}},[n("v-icon",[e._v("mdi-chevron-left")])],1),n("v-btn",{staticClass:"ml-1",attrs:{dark:"",color:"blue darken-3"},on:{click:e.nextPage}},[n("v-icon",[e._v("mdi-chevron-right")])],1)],1)]},proxy:!0}])}),n("v-data-table",{directives:[{name:"show",rawName:"v-show",value:!this.settings.viewMode,expression:"!this.settings.viewMode"}],staticClass:"elevation-1",attrs:{items:e.items,headers:e.headers,search:this.settings.search},scopedSlots:e._u([{key:"item",fn:function(t){var r=t.item;return[n("tr",e._l(e.headers,(function(t,s){return n("td",{key:s},[s>0?n("div",[n("v-chip",{attrs:{"text-color":"white",color:e.get_pv_color(r,t.text)}},[e._v(e._s(r[t.value]))])],1):0==s||1==s?n("div",[n("p",[e._v(e._s(r[t.value]))])]):e._e()])})),0)]}}])})],1)}),o=[],c=(n("99af"),n("4de4"),n("c740"),n("caad"),n("b0c0"),n("b680"),n("d3b7"),n("acd8"),n("2532"),n("ddb0"),n("b85c")),u=(n("96cf"),n("1da1")),l=function(){var e=Object(u["a"])(regeneratorRuntime.mark((function e(t){return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return e.abrupt("return",new Promise((function(e){setTimeout((function(){var n=[];fetch("config.json").then((function(e){return e.json()})).then((function(r){t.headers=r.headers;var s,a=Object(c["a"])(r.items);try{for(a.s();!(s=a.n()).done;){var i=s.value;t.config.push(i.config),t.items.push(i.fields),n=n.concat(i.config.pvs)}}catch(o){a.e(o)}finally{a.f()}e(n)}))}),100)})));case 1:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}(),d={props:["settings"],data:function(){return{filter:{},page:1,itemsPerPage:8,headers:[],items:[],config:[],symbols:{temperature:" C",pressure:" hPa",voltage:" V"}}},computed:{numberOfPages:function(){return Math.ceil(this.items.length/this.itemsPerPage)},filteredKeys:function(){return this.settings.keys.filter((function(e){return"Name"!==e}))}},methods:{nextPage:function(){this.page+1<=this.numberOfPages&&(this.page+=1)},formerPage:function(){this.page-1>=1&&(this.page-=1)},updateItemsPerPage:function(e){this.itemsPerPage=e},get_pv_color:function(e,t){if("?"===e[t.toLowerCase()])return"gray";var n=this.items.findIndex((function(t){return t.name===e.name})),r=parseFloat(e[t.toLowerCase()]),s=t.toLowerCase().substring(0,1);switch(t){case"Temperature":return r>this.config[n].t_hihi?"red":r>this.config[n].t_hi?"orange":"green";case"Rack open":return"No"===e["rack open"]?"green":"orange";default:return r>this.config[n][s+"_hihi"]||r<this.config[n][s+"_lolo"]?"red":r>this.config[n][s+"_hi"]||r<this.config[n][s+"_lo"]?"orange":"green"}}},created:function(){var e=this,t=new WebSocket("ws://127.0.0.1:5678/");t.onopen=Object(u["a"])(regeneratorRuntime.mark((function n(){var r;return regeneratorRuntime.wrap((function(n){while(1)switch(n.prev=n.next){case 0:return n.next=2,l(e);case 2:r=n.sent,t.send(r);case 4:case"end":return n.stop()}}),n)}))),t.onmessage=function(t){var n=JSON.parse(t.data),r=n["name"].toLowerCase(),s=e.config.findIndex((function(e){return e.pvs.includes(r)}));switch(r){case"pressure":e.items[s]["rack open"]=n.value>e.config[s].hatch?"No":"Yes";break;default:break}e.items[s][r]=n.value.toFixed(2)+e.symbols[r]}}},v=d,f=(n("dfba"),n("2877")),p=n("6544"),h=n.n(p),g=n("8336"),m=n("b0af"),b=n("99d9"),w=n("cc20"),_=n("62ad"),y=n("a523"),k=n("c377"),x=n("8fea"),P=n("ce7e"),V=n("132d"),C=n("8860"),M=n("da13"),O=n("5d23"),j=n("e449"),S=n("0fd9"),N=n("2fa4"),$=Object(f["a"])(v,i,o,!1,null,"33fc059d",null),T=$.exports;h()($,{VBtn:g["a"],VCard:m["a"],VCardTitle:b["a"],VChip:w["a"],VCol:_["a"],VContainer:y["a"],VDataIterator:k["a"],VDataTable:x["a"],VDivider:P["a"],VIcon:V["a"],VList:C["a"],VListItem:M["a"],VListItemContent:O["a"],VListItemTitle:O["b"],VMenu:j["a"],VRow:S["a"],VSpacer:N["a"]});var I=function(){var e=this,t=e.$createElement,r=e._self._c||t;return r("v-container",{attrs:{fluid:""}},[r("v-toolbar",{staticClass:"mb-1",attrs:{src:n("336c"),dark:"",color:"blue darken-3"}},[r("v-text-field",{attrs:{clearable:"",flat:"","solo-inverted":"","hide-details":"","prepend-inner-icon":"mdi-magnify",label:"Search"},on:{input:function(t){return e.$emit("search",t)}}}),e.$vuetify.breakpoint.mdAndUp?[r("v-spacer"),r("v-select",{directives:[{name:"show",rawName:"v-show",value:this.settings.viewMode,expression:"this.settings.viewMode"}],attrs:{flat:"","solo-inverted":"","hide-details":"",items:this.settings.keys,"prepend-inner-icon":"mdi-magnify",label:"Sort by"},on:{change:function(t){return e.$emit("desc",t)}}}),r("v-spacer"),r("v-btn-toggle",{directives:[{name:"show",rawName:"v-show",value:this.settings.viewMode,expression:"this.settings.viewMode"}],attrs:{mandatory:""},on:{change:function(t){return e.$emit("sort",t)}}},[r("v-btn",{attrs:{large:"",depressed:"",color:"blue",value:!1,align:"start"}},[r("v-icon",[e._v("mdi-trending-up")])],1),r("v-btn",{attrs:{large:"",depressed:"",color:"blue",value:!0}},[r("v-icon",[e._v("mdi-trending-down")])],1)],1),r("v-spacer"),r("v-btn-toggle",{attrs:{mandatory:""},on:{change:function(t){return e.$emit("view",t)}}},[r("v-btn",{attrs:{large:"",depressed:"",color:"blue",value:!1}},[r("v-icon",[e._v("mdi-table")])],1),r("v-btn",{attrs:{large:"",depressed:"",color:"blue",value:!0}},[r("v-icon",[e._v("mdi-view-module")])],1)],1)]:e._e(),e.$vuetify.breakpoint.smAndDown?[r("v-btn",{attrs:{icon:""},on:{click:function(t){e.dropdown=!e.dropdown}}},[r("v-icon",[e._v("mdi-menu")])],1)]:e._e()],2),e.dropdown&&e.$vuetify.breakpoint.smAndDown?r("v-toolbar",{staticClass:"mb-1",attrs:{dark:"",color:"blue darken-3"}},[r("v-select",{directives:[{name:"show",rawName:"v-show",value:this.settings.viewMode,expression:"this.settings.viewMode"}],attrs:{flat:"","solo-inverted":"","hide-details":"",items:this.settings.keys,"prepend-inner-icon":"mdi-magnify",label:"Sort by"},on:{change:function(t){return e.$emit("desc",t)}}}),r("v-btn",{directives:[{name:"show",rawName:"v-show",value:this.settings.viewMode,expression:"this.settings.viewMode"}],attrs:{icon:""},on:{click:function(t){return e.$emit("view",!1)}}},[r("v-icon",[e._v("mdi-table")])],1),r("v-btn",{directives:[{name:"show",rawName:"v-show",value:!this.settings.viewMode,expression:"!this.settings.viewMode"}],attrs:{icon:""},on:{click:function(t){return e.$emit("view",!0)}}},[r("v-icon",[e._v("mdi-view-module")])],1),r("v-btn-toggle",{directives:[{name:"show",rawName:"v-show",value:this.settings.viewMode,expression:"this.settings.viewMode"}],attrs:{mandatory:""},on:{change:function(t){return e.$emit("sort",t)}}},[r("v-btn",{attrs:{large:"",depressed:"",color:"blue",value:!1,align:"start"}},[r("v-icon",[e._v("mdi-trending-up")])],1),r("v-btn",{attrs:{large:"",depressed:"",color:"blue",value:!0}},[r("v-icon",[e._v("mdi-trending-down")])],1)],1)],1):e._e()],1)},D=[],L={props:["settings"],data:function(){return{filter:{},dropdown:!1}}},R=L,B=n("a609"),F=n("b974"),A=n("8654"),E=n("71d9"),J=Object(f["a"])(R,I,D,!1,null,null,null),K=J.exports;h()(J,{VBtn:g["a"],VBtnToggle:B["a"],VContainer:y["a"],VIcon:V["a"],VSelect:F["a"],VSpacer:N["a"],VTextField:A["a"],VToolbar:E["a"]});var Y=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("v-footer",{attrs:{color:"primary darken-2",padless:""}},[n("v-row",{attrs:{justify:"center","no-gutters":""}},[n("v-btn",{staticClass:"my-2",attrs:{href:"https://wiki-sirius.lnls.br/mediawiki/index.php/CON:CON",color:"white",text:"",rounded:""}},[e._v(" wiki ")]),n("v-btn",{staticClass:"my-2",attrs:{href:"https://gitlab.cnpem.br/IoT/simar-vue",color:"white",text:"",rounded:""}},[e._v(" gitlab ")]),n("v-btn",{staticClass:"my-2",attrs:{href:"mailto:guilherme.freitas@cnpem.br",color:"white",text:"",rounded:""}},[e._v(" contact ")]),n("v-col",{staticClass:"primary darken-3 py-4 text-center white--text",attrs:{cols:"12"}},[e._v(" "+e._s((new Date).getFullYear())+" — "),n("strong",[e._v("CNPEM")])])],1)],1)},U=[],W=n("553a"),q={},z=Object(f["a"])(q,Y,U,!1,null,null,null),G=z.exports;h()(z,{VBtn:g["a"],VCol:_["a"],VFooter:W["a"],VRow:S["a"]});var H={name:"App",components:{toolbar:K,iterator:T,ft:G},data:function(){return{settings:{sortDesc:!1,viewMode:!0,sortBy:"name",search:"",keys:["Name","Temperature","Pressure","Voltage","Rack open","Fan speed"]}}},methods:{updateSearch:function(e){this.settings.search=e},updateView:function(e){this.settings.viewMode=e},updateDesc:function(e){this.settings.sortBy=e.toLowerCase()},updateSort:function(e){this.settings.sortDesc=e}}},Q=H,X=(n("344b"),n("7496")),Z=n("f6c4"),ee=Object(f["a"])(Q,s,a,!1,null,"3611e291",null),te=ee.exports;h()(ee,{VApp:X["a"],VMain:Z["a"]});var ne=n("f309");r["a"].use(ne["a"]);var re=new ne["a"]({});r["a"].config.productionTip=!1,new r["a"]({vuetify:re,render:function(e){return e(te)}}).$mount("#app")},"6aad":function(e,t,n){},a3b1:function(e,t,n){},dfba:function(e,t,n){"use strict";n("a3b1")}});
//# sourceMappingURL=app.16bd382c.js.map