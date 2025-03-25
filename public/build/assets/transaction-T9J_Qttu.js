import{r as a,j as e,S as j}from"./app-DJa97arl.js";import{A as y}from"./AdminLayout-BAUsXvD1.js";import{T as N,a as v,b as p,c as b,d as w,e as g}from"./table-BU4XrRMv.js";import{P as C}from"./phone-CjaA0ELW.js";import{B as T}from"./banknote-CWwiX9-3.js";import{M as S}from"./mail-k6mcDVQp.js";import{C as f}from"./code-BMyiWB5B.js";import{C as z}from"./circle-alert-GLVn6Z4_.js";import{C as E}from"./circle-check-big-5_tSTUL5.js";import"./x-BxSEnrvq.js";import"./createLucideIcon-0J5g5tHA.js";import"./log-out-CuD3j2sV.js";import"./utils-CiMRq3MP.js";import"./clsx-B-dksMZM.js";const V=({transactionData:c})=>{const[r,d]=a.useState({mobile:"",referenceid:"",pincode:"",address:"",amount:"",txntype:"imps",dob:"",gst_state:"",bene_id:"",otp:"",stateresp:"",lat:"28.7041",long:"77.1025"}),[m,l]=a.useState(!1),[x,o]=a.useState(""),[u,n]=a.useState(""),t=s=>{d({...r,[s.target.name]:s.target.value}),o(""),n("")},h=s=>{s.preventDefault(),l(!0),o(""),n(""),j.post("/admin/transaction2/transact",r,{onSuccess:()=>{n("Transaction processed successfully!"),l(!1),d({mobile:"",referenceid:"",pincode:"",address:"",amount:"",txntype:"imps",dob:"",gst_state:"",bene_id:"",otp:"",stateresp:"",lat:"28.7041",long:"77.1025"})},onError:i=>{o(i.message||"Failed to process transaction"),l(!1)}})};return e.jsx(y,{children:e.jsx("div",{className:"max-w-full",children:e.jsxs("div",{className:"bg-white rounded-xl shadow-md overflow-hidden border border-gray-100",children:[e.jsx("div",{className:"bg-gradient-to-tr from-gray-400 to-black py-4 px-6",children:e.jsx("h2",{className:"text-3xl font-semibold text-white",children:"Transaction"})}),e.jsxs("form",{onSubmit:h,className:"p-6",children:[e.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-2 gap-6 mb-6",children:[e.jsxs("div",{children:[e.jsxs("label",{htmlFor:"mobile",className:"flex items-center text-sm font-medium text-gray-600 mb-1",children:[e.jsx(C,{size:20,className:"mr-2 text-yellow-500"}),"Mobile Number"]}),e.jsx("input",{id:"mobile",type:"text",name:"mobile",value:r.mobile,onChange:t,className:"w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all",required:!0,placeholder:"Enter Mobile Number"})]}),e.jsxs("div",{children:[e.jsxs("label",{htmlFor:"amount",className:"flex items-center text-sm font-medium text-gray-600 mb-1",children:[e.jsx(T,{size:20,className:"mr-2 text-blue-500"}),"Amount"]}),e.jsx("input",{id:"amount",type:"number",name:"amount",value:r.amount,onChange:t,className:"w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all",required:!0,min:"1",placeholder:"Enter Amount"})]}),e.jsxs("div",{children:[e.jsxs("label",{htmlFor:"bene_id",className:"flex items-center text-sm font-medium text-gray-600 mb-1",children:[e.jsx(S,{size:20,className:"mr-2 text-green-500"}),"Beneficiary ID"]}),e.jsx("div",{className:"flex gap-2",children:e.jsx("input",{id:"bene_id",type:"text",name:"bene_id",value:r.bene_id,onChange:t,className:"w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all",required:!0,placeholder:"Enter Beneficiary ID"})})]}),e.jsxs("div",{children:[e.jsxs("label",{htmlFor:"otp",className:"flex items-center text-sm font-medium text-gray-600 mb-1",children:[e.jsx(f,{size:20,className:"mr-2 text-purple-500"}),"OTP"]}),e.jsx("input",{id:"otp",type:"text",name:"otp",value:r.otp,onChange:t,className:"w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all",placeholder:"Enter OTP"})]})]}),e.jsx("button",{type:"submit",disabled:m,className:"w-full bg-gray-800 text-white py-3 px-4 rounded-lg hover:bg-black focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium",children:m?e.jsxs("span",{className:"flex items-center justify-center",children:[e.jsxs("svg",{className:"animate-spin -ml-1 mr-2 h-4 w-4 text-white",xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24",children:[e.jsx("circle",{className:"opacity-25",cx:"12",cy:"12",r:"10",stroke:"currentColor",strokeWidth:"4"}),e.jsx("path",{className:"opacity-75",fill:"currentColor",d:"M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"})]}),"Processing..."]}):"Process Transaction"})]}),e.jsxs("div",{className:"px-6 pb-6",children:[x&&e.jsx("div",{className:"mt-4 p-4 bg-red-50 border border-red-100 rounded-lg",children:e.jsxs("p",{className:"text-red-600 text-sm flex items-center",children:[e.jsx(z,{size:16,className:"mr-2"}),x]})}),u&&e.jsx("div",{className:"mt-4 p-4 bg-green-50 border border-green-100 rounded-lg",children:e.jsxs("p",{className:"text-green-600 text-sm flex items-center",children:[e.jsx(E,{size:16,className:"mr-2"}),u]})}),c&&e.jsxs("div",{className:"mt-4",children:[e.jsxs("h3",{className:"font-medium text-sm text-gray-700 mb-2 flex items-center",children:[e.jsx(f,{size:16,className:"mr-2"}),"API Response:"]}),e.jsx("div",{className:"border border-gray-200 rounded-lg shadow-md overflow-hidden",children:e.jsxs(N,{className:"w-full border-collapse",children:[e.jsx(v,{className:"bg-sky-500 text-white",children:e.jsxs(p,{children:[e.jsx(b,{className:"px-4 py-2 text-left",children:"Key"}),e.jsx(b,{className:"px-4 py-2 text-left",children:"Value"})]})}),e.jsx(w,{children:Object.entries(c).map(([s,i])=>e.jsxs(p,{className:"border-b border-gray-200",children:[e.jsx(g,{className:"px-4 py-2 font-medium",children:s}),e.jsx(g,{className:"px-4 py-2",children:JSON.stringify(i)})]},s))})]})})]})]})]})})})};export{V as default};
