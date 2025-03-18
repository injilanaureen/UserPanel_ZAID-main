import{r as d,j as e,a as N}from"./app-C9Hasp1L.js";import{A as y}from"./AdminLayout-dj7iNOPP.js";import{T as g,a as b,b as r,c as h,d as w,e as s}from"./table-4V-D0z2R.js";import{S as v}from"./search-hjW1zxKq.js";import{C as u}from"./circle-alert-B5c2DHMZ.js";import{C as A}from"./code-rxY6KSqe.js";import"./x-o7aJ_J0I.js";import"./createLucideIcon-BHfLX7CN.js";import"./utils-CiMRq3MP.js";import"./clsx-B-dksMZM.js";const H=()=>{const[i,j]=d.useState(""),[a,n]=d.useState(null),[c,m]=d.useState(null),[x,o]=d.useState(!1),f=async()=>{var l,p;o(!0),m(null),n(null);try{const t=await N.post("/admin/utility-bill-payment/fetch-utility-status",{referenceid:i});n(t.data)}catch(t){m(((p=(l=t.response)==null?void 0:l.data)==null?void 0:p.message)||"Error fetching status")}finally{o(!1)}};return e.jsx(y,{children:e.jsx("div",{className:"max-w-full p-4",children:e.jsxs("div",{className:"bg-white rounded-xl shadow-md overflow-hidden border border-gray-100",children:[e.jsx("div",{className:"bg-gradient-to-tr from-gray-400 to-black py-4 px-6",children:e.jsx("h2",{className:"text-3xl font-semibold text-white",children:"Utility Status Enquiry"})}),e.jsxs("div",{className:"p-6",children:[e.jsx("div",{className:"grid grid-cols-1 gap-6 mb-6",children:e.jsxs("div",{children:[e.jsxs("label",{htmlFor:"referenceid",className:"flex items-center text-sm font-medium text-gray-600 mb-1",children:[e.jsx(v,{size:20,className:"mr-2 text-blue-500"}),"Reference ID"]}),e.jsxs("div",{className:"flex gap-4",children:[e.jsx("input",{id:"referenceid",type:"text",className:"w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all",placeholder:"Enter Reference ID",value:i,onChange:l=>j(l.target.value)}),e.jsx("button",{onClick:f,disabled:x,className:"bg-gray-800 text-white py-3 px-6 rounded-lg hover:bg-black focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium whitespace-nowrap",children:x?e.jsxs("span",{className:"flex items-center",children:[e.jsxs("svg",{className:"animate-spin -ml-1 mr-2 h-4 w-4 text-white",xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24",children:[e.jsx("circle",{className:"opacity-25",cx:"12",cy:"12",r:"10",stroke:"currentColor",strokeWidth:"4"}),e.jsx("path",{className:"opacity-75",fill:"currentColor",d:"M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"})]}),"Fetching..."]}):"Check Status"})]})]})}),c&&e.jsx("div",{className:"mt-4 p-4 bg-red-50 border border-red-100 rounded-lg",children:e.jsxs("p",{className:"text-red-600 text-sm flex items-center",children:[e.jsx(u,{size:16,className:"mr-2"}),c]})}),a&&e.jsxs("div",{className:"mt-4",children:[e.jsxs("h3",{className:"font-medium text-sm text-gray-700 mb-2 flex items-center",children:[e.jsx(A,{size:16,className:"mr-2"}),"Transaction Details"]}),a.status&&a.data?e.jsx("div",{className:"border border-gray-200 rounded-lg shadow-md overflow-hidden",children:e.jsxs(g,{className:"w-full border-collapse",children:[e.jsx(b,{className:"bg-sky-500 text-white",children:e.jsxs(r,{children:[e.jsx(h,{className:"px-4 py-2 text-left",children:"Field"}),e.jsx(h,{className:"px-4 py-2 text-left",children:"Value"})]})}),e.jsxs(w,{children:[e.jsxs(r,{children:[e.jsx(s,{className:"px-4 py-2 font-medium",children:"Transaction ID"}),e.jsx(s,{className:"px-4 py-2",children:a.data.txnid})]}),e.jsxs(r,{children:[e.jsx(s,{className:"px-4 py-2 font-medium",children:"Operator Name"}),e.jsx(s,{className:"px-4 py-2",children:a.data.operatorname})]}),e.jsxs(r,{children:[e.jsx(s,{className:"px-4 py-2 font-medium",children:"Customer Number"}),e.jsx(s,{className:"px-4 py-2",children:a.data.canumber})]}),e.jsxs(r,{children:[e.jsx(s,{className:"px-4 py-2 font-medium",children:"Amount"}),e.jsxs(s,{className:"px-4 py-2",children:["₹",a.data.amount]})]}),e.jsxs(r,{children:[e.jsx(s,{className:"px-4 py-2 font-medium",children:"Additional Data 1"}),e.jsx(s,{className:"px-4 py-2",children:a.data.ad1||"N/A"})]}),e.jsxs(r,{children:[e.jsx(s,{className:"px-4 py-2 font-medium",children:"Additional Data 2"}),e.jsx(s,{className:"px-4 py-2",children:a.data.ad2||"N/A"})]}),e.jsxs(r,{children:[e.jsx(s,{className:"px-4 py-2 font-medium",children:"Additional Data 3"}),e.jsx(s,{className:"px-4 py-2",children:a.data.ad3||"N/A"})]}),e.jsxs(r,{children:[e.jsx(s,{className:"px-4 py-2 font-medium",children:"Commission"}),e.jsxs(s,{className:"px-4 py-2",children:["₹",a.data.comm]})]}),e.jsxs(r,{children:[e.jsx(s,{className:"px-4 py-2 font-medium",children:"TDS"}),e.jsxs(s,{className:"px-4 py-2",children:["₹",a.data.tds]})]}),e.jsxs(r,{children:[e.jsx(s,{className:"px-4 py-2 font-medium",children:"Transaction Status"}),e.jsx(s,{className:"px-4 py-2",children:a.data.status==="1"?"Success":"Failed"})]}),e.jsxs(r,{children:[e.jsx(s,{className:"px-4 py-2 font-medium",children:"Reference ID"}),e.jsx(s,{className:"px-4 py-2",children:a.data.refid})]}),e.jsxs(r,{children:[e.jsx(s,{className:"px-4 py-2 font-medium",children:"Operator ID"}),e.jsx(s,{className:"px-4 py-2",children:a.data.operatorid})]}),e.jsxs(r,{children:[e.jsx(s,{className:"px-4 py-2 font-medium",children:"Date Added"}),e.jsx(s,{className:"px-4 py-2",children:a.data.dateadded})]}),e.jsxs(r,{children:[e.jsx(s,{className:"px-4 py-2 font-medium",children:"Refunded"}),e.jsx(s,{className:"px-4 py-2",children:a.data.refunded==="0"?"No":"Yes"})]}),a.data.refunded!=="0"&&e.jsxs(e.Fragment,{children:[e.jsxs(r,{children:[e.jsx(s,{className:"px-4 py-2 font-medium",children:"Refund Transaction ID"}),e.jsx(s,{className:"px-4 py-2",children:a.data.refundtxnid||"N/A"})]}),e.jsxs(r,{children:[e.jsx(s,{className:"px-4 py-2 font-medium",children:"Date Refunded"}),e.jsx(s,{className:"px-4 py-2",children:a.data.daterefunded||"N/A"})]})]})]})]})}):e.jsx("div",{className:"mt-4 p-4 bg-red-50 border border-red-100 rounded-lg",children:e.jsxs("p",{className:"text-red-600 text-sm flex items-center",children:[e.jsx(u,{size:16,className:"mr-2"}),a.message||"No data found"]})})]})]})]})})})};export{H as default};
