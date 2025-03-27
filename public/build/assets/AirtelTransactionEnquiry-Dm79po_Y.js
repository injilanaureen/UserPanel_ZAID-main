import{K as g,r as a,j as e,S as j}from"./app-04dva_uV.js";import{A as y}from"./AdminLayout-BQfvYX0n.js";import{T as N,a as v,b as d,c as m,d as w,e as x}from"./table-DgZXOm1p.js";import{c as C}from"./createLucideIcon-CR20qr5H.js";import{C as h}from"./code--I1lvrNQ.js";import{C as p}from"./circle-alert-NIY0hKay.js";import"./x-BsVjYVey.js";import"./log-out-DndPUm7A.js";import"./utils-CiMRq3MP.js";import"./clsx-B-dksMZM.js";/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const T=[["path",{d:"M14 2v4a2 2 0 0 0 2 2h4",key:"tnqrlb"}],["path",{d:"M4.268 21a2 2 0 0 0 1.727 1H18a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v3",key:"ms7g94"}],["path",{d:"m9 18-1.5-1.5",key:"1j6qii"}],["circle",{cx:"5",cy:"14",r:"3",key:"ufru5t"}]],k=C("FileSearch",T),L=()=>{const{transactionData:t,error:l}=g().props,[r,u]=a.useState(""),[i,c]=a.useState(!1),[o,n]=a.useState(""),f=s=>{if(s.preventDefault(),!r.trim()){n("Reference ID is required.");return}n(""),c(!0),j.post("/airtel-transaction-enquiry",{refid:r},{onFinish:()=>c(!1)})};return e.jsx(y,{children:e.jsx("div",{className:"max-w-full",children:e.jsxs("div",{className:"bg-white rounded-xl shadow-md overflow-hidden border border-gray-100",children:[e.jsx("div",{className:"bg-gradient-to-tr from-gray-400 to-black py-4 px-6",children:e.jsxs("h2",{className:"text-3xl font-semibold text-white flex items-center",children:[e.jsx(k,{size:26,className:"mr-3"}),"Airtel Transaction Enquiry"]})}),e.jsxs("form",{onSubmit:f,className:"p-6",children:[e.jsx("div",{className:"grid grid-cols-1 md:grid-cols-2 gap-6 mb-6",children:e.jsxs("div",{children:[e.jsxs("label",{htmlFor:"refid",className:"flex items-center text-sm font-medium text-gray-600 mb-1",children:[e.jsx(h,{size:20,className:"mr-2 text-blue-500"}),"Reference ID"]}),e.jsx("input",{id:"refid",type:"text",value:r,onChange:s=>u(s.target.value),className:"w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all",required:!0,placeholder:"Enter Reference ID"})]})}),e.jsx("button",{type:"submit",disabled:i,className:"w-full bg-gray-800 text-white py-3 px-4 rounded-lg hover:bg-black focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium",children:i?e.jsxs("span",{className:"flex items-center justify-center",children:[e.jsxs("svg",{className:"animate-spin -ml-1 mr-2 h-4 w-4 text-white",xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24",children:[e.jsx("circle",{className:"opacity-25",cx:"12",cy:"12",r:"10",stroke:"currentColor",strokeWidth:"4"}),e.jsx("path",{className:"opacity-75",fill:"currentColor",d:"M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"})]}),"Checking..."]}):"Check Transaction"})]}),e.jsxs("div",{className:"px-6 pb-6",children:[o&&e.jsx("div",{className:"mt-4 p-4 bg-red-50 border border-red-100 rounded-lg",children:e.jsxs("p",{className:"text-red-600 text-sm flex items-center",children:[e.jsx(p,{size:16,className:"mr-2"}),o]})}),l&&e.jsx("div",{className:"mt-4 p-4 bg-red-50 border border-red-100 rounded-lg",children:e.jsxs("p",{className:"text-red-600 text-sm flex items-center",children:[e.jsx(p,{size:16,className:"mr-2"}),l]})}),t&&e.jsxs("div",{className:"mt-4",children:[e.jsxs("h3",{className:"font-medium text-sm text-gray-700 mb-2 flex items-center",children:[e.jsx(h,{size:16,className:"mr-2"}),"Transaction Details :"]}),e.jsx("div",{className:"border border-gray-200 rounded-lg shadow-md overflow-hidden",children:e.jsxs(N,{className:"w-full border-collapse",children:[e.jsx(v,{className:"bg-sky-500 text-white",children:e.jsxs(d,{children:[e.jsx(m,{className:"px-4 py-2 text-left",children:"Key"}),e.jsx(m,{className:"px-4 py-2 text-left",children:"Value"})]})}),e.jsx(w,{children:Object.entries(t).map(([s,b])=>e.jsxs(d,{className:"border-b border-gray-200",children:[e.jsx(x,{className:"px-4 py-2 font-medium",children:s}),e.jsx(x,{className:"px-4 py-2",children:String(b)})]},s))})]})})]})]})]})})})};export{L as default};
