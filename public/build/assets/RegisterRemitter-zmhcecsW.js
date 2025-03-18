import{r as i,j as e}from"./app-C9Hasp1L.js";import{A as P}from"./AdminLayout-dj7iNOPP.js";import{T as v,a as S,b as n,c as a,d as C,e as t}from"./table-4V-D0z2R.js";import{C as R}from"./circle-alert-B5c2DHMZ.js";import{C as A}from"./circle-check-big-D5jqm5fC.js";import{P as F}from"./phone-CjpF7r30.js";import{K as z}from"./key-CF55VdQ7.js";import{F as p}from"./file-text-D5_eeyJj.js";import{c as E}from"./createLucideIcon-BHfLX7CN.js";import{C as L}from"./code-rxY6KSqe.js";import"./x-o7aJ_J0I.js";import"./utils-CiMRq3MP.js";import"./clsx-B-dksMZM.js";/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const D=[["rect",{width:"20",height:"14",x:"2",y:"3",rx:"2",key:"48i651"}],["line",{x1:"8",x2:"16",y1:"21",y2:"21",key:"1svkeh"}],["line",{x1:"12",x2:"12",y1:"17",y2:"21",key:"vw1qmm"}]],I=E("Monitor",D),U=({recentRegistrations:u=[]})=>{const[r,T]=i.useState({mobile:"",otp:"",stateresp:"",data:"",accessmode:"SITE",is_iris:2}),[g,h]=i.useState(!1),[M,O]=i.useState(!1),[y,f]=i.useState(null),[b,c]=i.useState(null),[j,d]=i.useState(""),[m,N]=i.useState("form"),o=s=>{T({...r,[s.target.name]:s.target.value}),c(null),d("")},k=async s=>{var l;s.preventDefault(),h(!0),c(null),d(""),f(null);try{const x=await fetch("/api/admin/remitter2/register-remitter",{method:"POST",headers:{"Content-Type":"application/json","X-CSRF-TOKEN":(l=document.querySelector('meta[name="csrf-token"]'))==null?void 0:l.getAttribute("content")},body:JSON.stringify(r)}),w=await x.json();x.ok?(f(w.data),d("Remitter registered successfully!")):c(w.error||"Failed to register remitter")}catch{c("Failed to communicate with the server. Please try again.")}finally{h(!1)}};return e.jsx(P,{children:e.jsxs("div",{className:"max-w-full",children:[e.jsx("div",{className:"mb-6",children:e.jsxs("div",{className:"flex space-x-4 border-b",children:[e.jsx("button",{onClick:()=>N("form"),className:`py-2 px-4 font-medium ${m==="form"?"border-b-2 border-gray-800 text-gray-800":"text-gray-500 hover:text-gray-700"}`,children:"Registration Form"}),e.jsx("button",{onClick:()=>N("history"),className:`py-2 px-4 font-medium ${m==="history"?"border-b-2 border-gray-800 text-gray-800":"text-gray-500 hover:text-gray-700"}`,children:"Registration History"})]})}),m==="form"?e.jsxs("div",{className:"bg-white rounded-xl shadow-md overflow-hidden border border-gray-100",children:[e.jsx("div",{className:"bg-gradient-to-tr from-gray-400 to-black py-4 px-6",children:e.jsx("h2",{className:"text-3xl font-semibold text-white",children:"Register Remitter"})}),e.jsxs("form",{onSubmit:k,className:"p-6",children:[b&&e.jsx("div",{className:"mb-6 p-4 bg-red-50 border border-red-100 rounded-lg",children:e.jsxs("p",{className:"text-red-600 text-sm flex items-center",children:[e.jsx(R,{size:16,className:"mr-2"}),b]})}),j&&e.jsx("div",{className:"mb-6 p-4 bg-green-50 border border-green-100 rounded-lg",children:e.jsxs("p",{className:"text-green-600 text-sm flex items-center",children:[e.jsx(A,{size:16,className:"mr-2"}),j]})}),e.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-2 gap-6 mb-6",children:[e.jsxs("div",{className:"flex flex-col",children:[e.jsxs("label",{htmlFor:"mobile",className:"flex items-center text-sm font-medium text-gray-600 mb-1",children:[e.jsx(F,{size:20,className:"mr-2 text-blue-500"}),"Mobile Number"]}),e.jsx("div",{className:"flex",children:e.jsx("input",{type:"text",id:"mobile",name:"mobile",pattern:"[0-9]{10}",maxLength:"10",value:r.mobile,onChange:o,className:"flex-grow px-4 py-2 bg-gray-50 border border-gray-200 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all",required:!0,placeholder:"Enter 10 digit mobile number"})})]}),e.jsxs("div",{children:[e.jsxs("label",{htmlFor:"otp",className:"flex items-center text-sm font-medium text-gray-600 mb-1",children:[e.jsx(z,{size:20,className:"mr-2 text-yellow-500"}),"OTP"]}),e.jsx("input",{type:"text",id:"otp",name:"otp",pattern:"[0-9]{6}",maxLength:"6",value:r.otp,onChange:o,className:"w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all",required:!0,placeholder:"Enter 6 digit OTP"})]}),e.jsxs("div",{children:[e.jsxs("label",{htmlFor:"stateresp",className:"flex items-center text-sm font-medium text-gray-600 mb-1",children:[e.jsx(p,{size:20,className:"mr-2 text-green-500"}),"State Response"]}),e.jsx("input",{type:"text",id:"stateresp",name:"stateresp",value:r.stateresp,onChange:o,className:"w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all",required:!0,placeholder:"Enter state response"})]}),e.jsxs("div",{children:[e.jsxs("label",{htmlFor:"data",className:"flex items-center text-sm font-medium text-gray-600 mb-1",children:[e.jsx(p,{size:20,className:"mr-2 text-purple-500"}),"Data(Pid)"]}),e.jsx("input",{type:"text",id:"data",name:"data",value:r.data,onChange:o,className:"w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all",required:!0,placeholder:"Enter data"})]}),e.jsxs("div",{children:[e.jsxs("label",{htmlFor:"accessmode",className:"flex items-center text-sm font-medium text-gray-600 mb-1",children:[e.jsx(I,{size:20,className:"mr-2 text-blue-500"}),"Access Mode"]}),e.jsxs("select",{id:"accessmode",name:"accessmode",value:r.accessmode,onChange:o,className:"w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all",children:[e.jsx("option",{value:"SITE",children:"SITE"}),e.jsx("option",{value:"APP",children:"APP"})]})]}),e.jsxs("div",{children:[e.jsxs("label",{htmlFor:"is_iris",className:"flex items-center text-sm font-medium text-gray-600 mb-1",children:[e.jsx(p,{size:20,className:"mr-2 text-orange-500"}),"Is Iris"]}),e.jsxs("select",{id:"is_iris",name:"is_iris",value:r.is_iris,onChange:o,className:"w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all",children:[e.jsx("option",{value:2,children:"No"}),e.jsx("option",{value:1,children:"Yes"})]})]})]}),e.jsx("button",{type:"submit",disabled:g,className:"w-full bg-gray-800 text-white py-3 px-4 rounded-lg hover:bg-black focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium",children:g?e.jsxs("span",{className:"flex items-center justify-center",children:[e.jsxs("svg",{className:"animate-spin -ml-1 mr-2 h-4 w-4 text-white",xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24",children:[e.jsx("circle",{className:"opacity-25",cx:"12",cy:"12",r:"10",stroke:"currentColor",strokeWidth:"4"}),e.jsx("path",{className:"opacity-75",fill:"currentColor",d:"M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"})]}),"Processing..."]}):"Register Remitter"})]}),y&&e.jsx("div",{className:"px-6 pb-6",children:e.jsxs("div",{className:"mt-4",children:[e.jsxs("h3",{className:"font-medium text-sm text-gray-700 mb-2 flex items-center",children:[e.jsx(L,{size:16,className:"mr-2"}),"API Response:"]}),e.jsx("div",{className:"border border-gray-200 rounded-lg shadow-md overflow-hidden",children:e.jsxs(v,{className:"w-full border-collapse",children:[e.jsx(S,{className:"bg-sky-500 text-white",children:e.jsxs(n,{children:[e.jsx(a,{className:"px-4 py-2 text-left",children:"Key"}),e.jsx(a,{className:"px-4 py-2 text-left",children:"Value"})]})}),e.jsx(C,{children:Object.entries(y).map(([s,l])=>e.jsxs(n,{className:"border-b border-gray-200",children:[e.jsx(t,{className:"px-4 py-2 font-medium",children:s}),e.jsx(t,{className:"px-4 py-2",children:String(l)})]},s))})]})})]})})]}):e.jsxs("div",{className:"bg-white rounded-xl shadow-md overflow-hidden border border-gray-100",children:[e.jsx("div",{className:"bg-gradient-to-tr from-gray-400 to-black py-4 px-6",children:e.jsx("h2",{className:"text-3xl font-semibold text-white",children:"Registration History"})}),e.jsx("div",{className:"p-6 overflow-x-auto",children:e.jsxs(v,{className:"w-full",children:[e.jsx(S,{className:"bg-gray-50",children:e.jsxs(n,{children:[e.jsx(a,{className:"px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase",children:"Date"}),e.jsx(a,{className:"px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase",children:"Mobile"}),e.jsx(a,{className:"px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase",children:"Status"}),e.jsx(a,{className:"px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase",children:"Message"}),e.jsx(a,{className:"px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase",children:"Access Mode"}),e.jsx(a,{className:"px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase",children:"Limit"})]})}),e.jsx(C,{children:u.length===0?e.jsx(n,{children:e.jsx(t,{colSpan:6,className:"px-4 py-8 text-center text-gray-500",children:"No registration data available"})}):u.map((s,l)=>e.jsxs(n,{className:l%2===0?"bg-white":"bg-gray-50",children:[e.jsx(t,{className:"px-4 py-3 whitespace-nowrap text-sm text-gray-500",children:new Date(s.created_at).toLocaleString()}),e.jsx(t,{className:"px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900",children:s.mobile}),e.jsx(t,{className:"px-4 py-3 whitespace-nowrap",children:e.jsx("span",{className:`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${s.status==="success"?"bg-green-100 text-green-800":s.status==="error"?"bg-red-100 text-red-800":"bg-yellow-100 text-yellow-800"}`,children:s.status||"Pending"})}),e.jsx(t,{className:"px-4 py-3 text-sm text-gray-500",children:s.message}),e.jsx(t,{className:"px-4 py-3 whitespace-nowrap text-sm text-gray-500",children:s.accessmode}),e.jsx(t,{className:"px-4 py-3 whitespace-nowrap text-sm text-gray-500",children:s.limit?`₹${s.limit.toLocaleString()}`:"N/A"})]},s.id||l))})]})})]})]})})};export{U as default};
