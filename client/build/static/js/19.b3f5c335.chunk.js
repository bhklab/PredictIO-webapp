(this.webpackJsonpclient=this.webpackJsonpclient||[]).push([[19],{194:function(e,t,n){"use strict";n.r(t);var r=n(44),i=n(15),a=n(0),o=n.n(a),c=n(45),s=n(16),l=n(59),u=n(49),p=n(47),d=n.n(p),b=n(50),h=n.n(b),f=n(79),j=n(1),g=function(){var e=Object(a.useState)([]),t=Object(r.a)(e,2),n=t[0],i=t[1],c=[{Header:"Name",accessor:"dataset_name",Cell:function(e){return Object(j.jsx)("a",{href:"/dataset/".concat(e.row.original.dataset_id),children:e.value})}},{Header:"Publication",accessor:"pmid",Cell:function(e){return Object(j.jsx)("a",{href:e.value,target:"_blank",rel:"noopener noreferrer",children:"PMID: ".concat(e.value.split(".gov/")[1].replace(/\D/g,""))})}},{Header:"Source",accessor:"identifiers",Cell:function(e){return e.value.length>0?Object(j.jsx)("span",{children:e.value.map((function(t,n){return Object(j.jsxs)("span",{children:[t.link.length>0?Object(j.jsx)("a",{href:t.link,target:"_blank",rel:"noopener noreferrer",children:t.identifier}):t.identifier,n+1<e.value.length?", ":""]},n)}))}):"Data Access Restricted"}}];return Object(a.useEffect)((function(){var e=function(){var e=Object(u.a)(d.a.mark((function e(){var t;return d.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,h.a.get("/api/datasets");case 2:(t=e.sent).data.sort((function(e,t){return e.dataset_name.localeCompare(t.dataset_name)})),i(t.data);case 5:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}();e()}),[]),Object(j.jsxs)(o.a.Fragment,{children:[Object(j.jsx)("h3",{children:"Datasets"}),Object(j.jsx)("div",{children:Object(j.jsx)(f.a,{columns:c,data:n,pageRowNum:25})})]})},m=function(){var e=Object(a.useState)([]),t=Object(r.a)(e,2),n=t[0],i=t[1],c=[{Header:"Name",accessor:"signature"},{Header:"Method",accessor:"method"},{Header:"Association",accessor:"association"},{Header:"Source",accessor:"pmid",Cell:function(e){return Object(j.jsx)("a",{href:e.value,target:"_blank",rel:"noopener noreferrer",children:"PMID: ".concat(e.value.split(".gov/")[1].replace(/\D/g,""))})}},{Header:"Definition",accessor:"definition"}];return Object(a.useEffect)((function(){var e=function(){var e=Object(u.a)(d.a.mark((function e(){var t;return d.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,h.a.get("/api/signatures");case 2:t=e.sent,console.log(t.data),t.data.sort((function(e,t){return e.signature.localeCompare(t.signature)})),i(t.data);case 6:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}();e()}),[]),Object(j.jsxs)(o.a.Fragment,{children:[Object(j.jsx)("h3",{children:"Signatures"}),Object(j.jsx)("div",{children:Object(j.jsx)(f.a,{columns:c,data:n,pageRowNum:20})})]})},O=n(48);function x(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}function v(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}function y(e,t){return y=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e},y(e,t)}function k(e){return k="function"===typeof Symbol&&"symbol"===typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"===typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},k(e)}function w(e,t){return!t||"object"!==k(t)&&"function"!==typeof t?v(e):t}function P(e){return P=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)},P(e)}function R(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function N(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function S(e){var t=function(){if("undefined"===typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"===typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(e){return!1}}();return function(){var n,r=P(e);if(t){var i=P(this).constructor;n=Reflect.construct(r,arguments,i)}else n=r.apply(this,arguments);return w(this,n)}}var C=function(e){!function(e,t){if("function"!==typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&y(e,t)}(c,e);var t,n,r,i=S(c);function c(e){var t;return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,c),(t=i.call(this,e)).state={},t.onClick=t.onClick.bind(v(t)),t.onFocus=t.onFocus.bind(v(t)),t.onBlur=t.onBlur.bind(v(t)),t.inputRef=Object(a.createRef)(t.props.inputRef),t}return t=c,n=[{key:"select",value:function(e){this.inputRef.current.checked=!0,this.onClick(e)}},{key:"onClick",value:function(e){!this.props.disabled&&this.props.onChange&&(this.props.onChange({originalEvent:e,value:this.props.value,checked:!this.props.checked,stopPropagation:function(){},preventDefault:function(){},target:{name:this.props.name,id:this.props.id,value:this.props.value,checked:!this.props.checked}}),this.inputRef.current.checked=!this.props.checked,this.inputRef.current.focus())}},{key:"onFocus",value:function(){this.setState({focused:!0})}},{key:"onBlur",value:function(){this.setState({focused:!1})}},{key:"updateInputRef",value:function(){var e=this.props.inputRef;e&&("function"===typeof e?e(this.inputRef.current):e.current=this.inputRef.current)}},{key:"componentDidMount",value:function(){this.updateInputRef(),this.props.tooltip&&this.renderTooltip()}},{key:"componentDidUpdate",value:function(e){e.tooltip===this.props.tooltip&&e.tooltipOptions===this.props.tooltipOptions||(this.tooltip?this.tooltip.update(function(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?N(Object(n),!0).forEach((function(t){R(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):N(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}({content:this.props.tooltip},this.props.tooltipOptions||{})):this.renderTooltip())}},{key:"componentWillUnmount",value:function(){this.tooltip&&(this.tooltip.destroy(),this.tooltip=null)}},{key:"renderTooltip",value:function(){this.tooltip=Object(O.m)({target:this.element,content:this.props.tooltip,options:this.props.tooltipOptions})}},{key:"render",value:function(){var e=this;this.inputRef&&this.inputRef.current&&(this.inputRef.current.checked=this.props.checked);var t=Object(O.l)("p-radiobutton p-component",{"p-radiobutton-checked":this.props.checked,"p-radiobutton-disabled":this.props.disabled,"p-radiobutton-focused":this.state.focused},this.props.className),n=Object(O.l)("p-radiobutton-box",{"p-highlight":this.props.checked,"p-disabled":this.props.disabled,"p-focus":this.state.focused});return o.a.createElement("div",{ref:function(t){return e.element=t},id:this.props.id,className:t,style:this.props.style,onClick:this.onClick},o.a.createElement("div",{className:"p-hidden-accessible"},o.a.createElement("input",{ref:this.inputRef,id:this.props.inputId,type:"radio","aria-labelledby":this.props.ariaLabelledBy,name:this.props.name,defaultChecked:this.props.checked,onFocus:this.onFocus,onBlur:this.onBlur,disabled:this.props.disabled,required:this.props.required,tabIndex:this.props.tabIndex})),o.a.createElement("div",{className:n,ref:function(t){e.box=t},role:"radio","aria-checked":this.props.checked},o.a.createElement("div",{className:"p-radiobutton-icon"})))}}],n&&x(t.prototype,n),r&&x(t,r),c}(a.Component);R(C,"defaultProps",{id:null,inputRef:null,inputId:null,name:null,value:null,checked:!1,style:null,className:null,disabled:!1,required:!1,tabIndex:null,tooltip:null,tooltipOptions:null,ariaLabelledBy:null,onChange:null});var F,D,_=n(17),I=s.b.div(F||(F=Object(i.a)(["\n    display: flex;\n    margin-top: 20px;\n    font-size: 14px;\n    .radiobutton-field {\n        margin-right: 20px;\n        label {\n            margin-left: 5px;\n        }\n    }\n"]))),B=Object(s.b)(C)(D||(D=Object(i.a)(["\n    .p-radiobutton-box.p-highlight {\n        border-color: ",";\n        background: ",";\n    }\n    .p-radiobutton-box.p-highlight.p-focus {\n        border-color: ",";\n        background: ",";\n        box-shadow: none;\n    }\n"])),_.a.blue,_.a.blue,_.a.blue,_.a.blue);t.default=function(){var e=Object(a.useState)("datasets"),t=Object(r.a)(e,2),n=t[0],i=t[1];return Object(j.jsx)(c.a,{children:Object(j.jsxs)(l.a,{children:[Object(j.jsxs)(I,{children:[Object(j.jsx)("div",{className:"radiobutton-field",children:"Display:"}),Object(j.jsxs)("div",{className:"radiobutton-field",children:[Object(j.jsx)(B,{inputId:"datasets",value:"datasets",name:"display",onChange:function(e){return i(e.value)},checked:"datasets"===n}),Object(j.jsx)("label",{htmlFor:"datasets",children:"Datasets"})]}),Object(j.jsxs)("div",{className:"radiobutton-field",children:[Object(j.jsx)(B,{inputId:"signatures",value:"signatures",name:"display",onChange:function(e){return i(e.value)},checked:"signatures"===n}),Object(j.jsx)("label",{htmlFor:"signatures",children:"Signatures"})]})]}),"datasets"===n&&Object(j.jsx)(g,{}),"signatures"===n&&Object(j.jsx)(m,{})]})})}},45:function(e,t,n){"use strict";var r,i,a,o,c,s,l,u,p=n(15),d=n(0),b=n.n(d),h=n(18),f=n(16),j=n(17),g=f.b.div(r||(r=Object(p.a)(["\n    width: 100%;\n    height: 50px;\n    background-color: ",";\n"])),j.a.blue),m=f.b.div(i||(i=Object(p.a)(["\n    width: 90%;\n    max-width: 1500px;\n    height: 100%;\n    margin-left: auto;\n    margin-right: auto;\n    display: flex;\n    align-items: center;\n    font-size: 12px;\n"]))),O=f.b.div(a||(a=Object(p.a)(["\n    height: 70%;\n    align-items: center;\n    img {\n        height: 100%;\n    }\n"]))),x=f.b.div(o||(o=Object(p.a)(["\n    width: 70%;\n    min-width: 560px;\n    display: flex;\n    justify-content: space-between;\n    padding: 0px 30px;\n    a {\n        color: #ffffff;\n    }\n    a:last-child {\n        margin-right: 0;\n    }\n"]))),v=n(1),y=function(){return Object(v.jsx)(g,{children:Object(v.jsxs)(m,{children:[Object(v.jsx)(O,{children:Object(v.jsx)("img",{alt:"PredictIO",src:"./images/logos/logo-white.png"})}),Object(v.jsxs)(x,{children:[Object(v.jsx)(h.b,{to:"/",children:"Home"}),Object(v.jsx)(h.b,{to:"/explore/precomputed",children:"Pre-computed Signatures"}),Object(v.jsx)(h.b,{to:"/explore/biomarker/request",children:"Biomarker Evaluation"}),Object(v.jsx)(h.b,{to:"/predictio/request",children:"PredictIO"}),Object(v.jsx)(h.b,{to:"/datasets_signatures",children:"Datasets and Signatures"}),Object(v.jsx)(h.b,{to:"/analysis_status",children:"Analysis Status"}),Object(v.jsx)(h.b,{to:"/about",children:"About"}),Object(v.jsx)(h.b,{to:"/contact",children:"Contact"})]})]})})},k=f.b.div(c||(c=Object(p.a)(["\n    position relative;\n    bottom: 0%;\n    width: 100%;\n    height: 44px;\n    display: flex;\n    align-items: center;\n"]))),w=f.b.div(s||(s=Object(p.a)(["\n    width: 90%;\n    height: 100%;\n    max-width: 1500px;\n    margin-left: auto;\n    margin-right: auto;\n    border-top: 1px solid ",";\n    display: flex;\n    align-items: center;\n    justify-content: space-between;\n"])),j.a.blue),P=f.b.div(l||(l=Object(p.a)(["\n    color: ",";\n    font-size: 10px;\n    a {\n        color: ",";\n    }\n    .divider {\n        margin: 0px 10px;\n    }\n"])),j.a.blue,j.a.blue),R=function(){return Object(v.jsx)(k,{children:Object(v.jsxs)(w,{children:[Object(v.jsxs)(P,{children:[Object(v.jsx)("span",{className:"link",children:"Terms"}),Object(v.jsx)("span",{className:"divider",children:"|"}),Object(v.jsx)("span",{className:"link",children:"Privacy"}),Object(v.jsx)("span",{className:"divider",children:"|"}),Object(v.jsx)("span",{className:"link",children:"Support"})]}),Object(v.jsx)(P,{children:"BHK Lab \xa9 2020-2021"})]})})},N=f.b.main(u||(u=Object(p.a)(["\n    min-height: 100vh;\n    width: 90%;\n    max-width: 1500px;\n    margin-left: auto;\n    margin-right: auto;\n    margin-bottom: 500px;\n    display: flex;\n    flex-direction: column;\n"]))),S=function(e){var t=e.children;return Object(v.jsxs)(b.a.Fragment,{children:[Object(v.jsx)(y,{}),Object(v.jsx)(N,{children:t}),Object(v.jsx)(R,{})]})};S.defaultProps={page:"",children:null};t.a=S},59:function(e,t,n){"use strict";n.d(t,"a",(function(){return a}));var r,i=n(15),a=n(16).b.div(r||(r=Object(i.a)(["\n    width: 80%;\n    height: calc(100vh + 50px);\n"])))},79:function(e,t,n){"use strict";var r,i=n(51),a=n(46),o=n(66),c=n(44),s=n(0),l=n.n(s),u=n(125),p=n(15),d=n(17),b=n(16).b.div(r||(r=Object(p.a)(["\n  // margin: 10%;\n  //margin: 20px 40px 20px 40px;\n  overflow-x: auto;\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  justify-content: center;\n\n  h1 {\n    color: #c61a1a;\n    font-family: 'Raleway', sans-serif;\n    font-size: calc(1em + 1vw);\n    text-align: center;\n    margin-bottom: 50px;\n  }\n\n  table {\n    border-spacing: 0;\n    border: 1px solid rgba(159, 171, 187, 0.62);\n    border-radius: 3px;\n    width: 100%;\n    font-size: clamp(12px, calc(1vw + 1px), 14px);\n    background-color: white;\n\n    th,\n    td {\n      color: dimgray;\n      //max-width: 80px;\n      padding: calc(0.3vw + 0.3em);\n      border-bottom: 1px solid rgba(220, 221, 226, 0.24);\n      border-right: 1px solid rgba(220, 221, 226, 0.55);\n\n      :last-child {\n        border-right: 0;\n      }\n\n      a {\n        color: ",";\n\n        :hover {\n          color: ",";\n        }\n      }\n    }\n  ;\n  }\n\n  tr {\n    :hover {\n      background: rgba(103, 147, 190, 0.13);\n    }\n  }\n\n  th {\n    font-weight: 600;\n    background-color: rgba(103, 147, 190, 0.13);\n  }\n\n  .top-settings {\n    width: 100%;\n    margin-bottom: 10px;\n    .search-container {\n      display: flex;\n      align-items: center;\n      input {\n        margin-left: 5px;\n      }\n      i {\n        font-size: 14px;\n      }\n    }\n  }\n\n  .pagination {\n    display: flex;\n    align-items: center;\n    margin-top: 10px;\n    font-size: 14px;\n    button {\n      cursor: pointer;\n      border: none;\n      background: none;\n      outline: none;\n    }\n  }\n"])),d.a.blue,d.a.hover_blue),h=n(1),f=function(e){var t=e.preGlobalFilteredRows,n=e.globalFilter,r=e.setGlobalFilter,i=t.length,a=l.a.useState(n),o=Object(c.a)(a,2),s=o[0],p=o[1],d=Object(u.useAsyncDebounce)((function(e){r(e||void 0)}),200);return Object(h.jsxs)("div",{className:"search-container",children:[Object(h.jsx)("i",{className:"pi pi-search"}),Object(h.jsx)("input",{className:"search",type:"text",value:s||"",onChange:function(e){p(e.target.value),d(e.target.value)},placeholder:"Search ".concat(i," rows...")})]})},j=function(e){var t=e.columns,n=e.data,r=e.disablePagination,c=void 0!==r&&r,s=e.showGlobalFilter,l=void 0===s||s,p=e.pageRowNum,d=void 0===p?10:p,j=Object(u.useTable)({columns:t,data:n,initialState:{pageIndex:0,pageSize:d}},u.useGlobalFilter,u.useSortBy,u.usePagination),g=j.getTableProps,m=j.getTableBodyProps,O=j.headerGroups,x=j.prepareRow,v=j.page,y=j.canPreviousPage,k=j.canNextPage,w=j.gotoPage,P=j.nextPage,R=j.previousPage,N=j.pageOptions,S=j.preGlobalFilteredRows,C=j.setGlobalFilter,F=j.state,D=F.pageIndex,_=(F.pageSize,F.globalFilter);return Object(h.jsxs)(b,{children:[Object(h.jsx)("div",{className:"top-settings",children:l&&Object(h.jsx)(f,{preGlobalFilteredRows:S,globalFilter:_,setGlobalFilter:C})}),Object(h.jsxs)("table",Object(a.a)(Object(a.a)({},g()),{},{children:[Object(h.jsx)("thead",{children:O.map((function(e){return Object(h.jsx)("tr",Object(a.a)(Object(a.a)({},e.getHeaderGroupProps()),{},{children:e.headers.map((function(e){return Object(h.jsx)("th",Object(a.a)(Object(a.a)({},e.getHeaderProps(e.getSortByToggleProps())),{},{children:e.render("Header")}))}))}))}))}),Object(h.jsx)("tbody",Object(a.a)(Object(a.a)({},m()),{},{children:function(){var e,r=t.filter((function(e){return e.merged})),c=Object(o.a)(r);try{var s=function(){var t=e.value,r=n.map((function(e){return e[t.accessor]}));t.mergedValues=Object(i.a)(new Set(r)).map((function(e){return{value:e,count:r.filter((function(t){return t===e})).length,rendered:!1}}))};for(c.s();!(e=c.n()).done;)s()}catch(l){c.e(l)}finally{c.f()}return v.map((function(e){return x(e),Object(h.jsx)("tr",Object(a.a)(Object(a.a)({},e.getRowProps()),{},{children:e.cells.map((function(e){var t=0;if(e.column.merged){var n=r.find((function(t){return e.column.id===t.accessor})).mergedValues.find((function(t){return t.value===e.value}));n.count>1?n.rendered||(t=n.count,n.rendered=!0):t=1}else t=1;return t>0?Object(h.jsx)("td",Object(a.a)(Object(a.a)({className:e.column.center?"center":""},e.getCellProps()),{},{rowSpan:t,children:e.render("Cell")})):void 0}))}))}))}()}))]})),!c&&Object(h.jsxs)("div",{className:"pagination",children:[Object(h.jsx)("button",{className:"prev",onClick:function(){return R()},disabled:!y,children:Object(h.jsx)("i",{className:"pi pi-angle-left"})}),Object(h.jsxs)("span",{children:["Page"," ",Object(h.jsxs)("strong",{children:[Object(h.jsx)("input",{type:"number",value:D+1,onChange:function(e){var t=e.target.value?Number(e.target.value)-1:0;w(t)},style:{width:"40px"}})," ","of"," ",N.length]})," "]}),Object(h.jsx)("button",{className:"next",onClick:function(){return P()},disabled:!k,children:Object(h.jsx)("i",{className:"pi pi-angle-right"})})]})]})};j.defaultProps={data:[],columns:[],disablePagination:!1};t.a=j}}]);