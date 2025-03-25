import{r as c,j as e,S as p}from"./app-DJa97arl.js";import{A as h}from"./AdminLayout-BAUsXvD1.js";import{T as u,a as b,b as n,c as d,d as g,e as m}from"./table-BU4XrRMv.js";import{S as j}from"./search-BZMMNtJZ.js";import{C as N}from"./code-BMyiWB5B.js";import{C as y}from"./circle-alert-GLVn6Z4_.js";import"./x-BxSEnrvq.js";import"./createLucideIcon-0J5g5tHA.js";import"./log-out-CuD3j2sV.js";import"./utils-CiMRq3MP.js";import"./clsx-B-dksMZM.js";const E=({transactionData:r,referenceId:t})=>{const[l,x]=c.useState(t||""),[o,i]=c.useState(!1),f=s=>{s.preventDefault(),i(!0),p.post(route("transaction2.transactionStatus"),{referenceid:l},{preserveState:!0,onFinish:()=>i(!1)})};return e.jsx(h,{children:e.jsx("div",{className:"max-w-full",children:e.jsxs("div",{className:"bg-white rounded-xl shadow-md overflow-hidden border border-gray-100",children:[e.jsx("div",{className:"bg-gradient-to-tr from-gray-400 to-black py-4 px-6",children:e.jsx("h2",{className:"text-3xl font-semibold text-white",children:"Transaction Status"})}),e.jsxs("form",{onSubmit:f,className:"p-6",children:[e.jsxs("div",{className:"mb-6",children:[e.jsxs("label",{htmlFor:"referenceId",className:"flex items-center text-sm font-medium text-gray-600 mb-1",children:[e.jsx(j,{size:20,className:"mr-2 text-blue-500"}),"Reference ID"]}),e.jsx("input",{id:"referenceId",type:"text",value:l,onChange:s=>x(s.target.value),placeholder:"Enter Reference ID",required:!0,className:"w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all"})]}),e.jsx("button",{type:"submit",disabled:o,className:"w-full bg-gray-800 text-white py-3 px-4 rounded-lg hover:bg-black focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium",children:o?e.jsxs("span",{className:"flex items-center justify-center",children:[e.jsxs("svg",{className:"animate-spin -ml-1 mr-2 h-4 w-4 text-white",xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24",children:[e.jsx("circle",{className:"opacity-25",cx:"12",cy:"12",r:"10",stroke:"currentColor",strokeWidth:"4"}),e.jsx("path",{className:"opacity-75",fill:"currentColor",d:"M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"})]}),"Checking..."]}):"Check Status"})]}),e.jsxs("div",{className:"px-6 pb-6",children:[r&&e.jsxs("div",{className:"mt-4",children:[e.jsxs("h3",{className:"font-medium text-sm text-gray-700 mb-2 flex items-center",children:[e.jsx(N,{size:16,className:"mr-2"}),"Transaction Details for Reference ID: ",t]}),e.jsx("div",{className:"border border-gray-200 rounded-lg shadow-md overflow-hidden",children:e.jsxs(u,{className:"w-full border-collapse",children:[e.jsx(b,{className:"bg-sky-500 text-white",children:e.jsxs(n,{children:[e.jsx(d,{className:"px-4 py-2 text-left",children:"Key"}),e.jsx(d,{className:"px-4 py-2 text-left",children:"Value"})]})}),e.jsx(g,{children:Object.entries(r).map(([s,a])=>e.jsxs(n,{className:"border-b border-gray-200",children:[e.jsx(m,{className:"px-4 py-2 font-medium capitalize",children:s.replace(/_/g," ")}),e.jsx(m,{className:"px-4 py-2",children:typeof a=="object"?JSON.stringify(a):String(a)})]},s))})]})})]}),!r&&t&&e.jsx("div",{className:"mt-4 p-4 bg-red-50 border border-red-100 rounded-lg",children:e.jsxs("p",{className:"text-red-600 text-sm flex items-center",children:[e.jsx(y,{size:16,className:"mr-2"}),"No transaction data found for the provided Reference ID."]})})]})]})})})};export{E as default};
