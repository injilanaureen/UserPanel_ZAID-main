import{r as l,j as e,a as p}from"./app-C9Hasp1L.js";import{A as v}from"./AdminLayout-dj7iNOPP.js";import{T as S,a as C,b,c as f,d as R,e as g}from"./table-4V-D0z2R.js";import{P as T}from"./phone-CjpF7r30.js";import{C as k}from"./circle-alert-B5c2DHMZ.js";import{C as z}from"./circle-check-big-D5jqm5fC.js";import{C as A}from"./code-rxY6KSqe.js";import"./x-o7aJ_J0I.js";import"./createLucideIcon-BHfLX7CN.js";import"./utils-CiMRq3MP.js";import"./clsx-B-dksMZM.js";const Q=()=>{const[i,j]=l.useState(""),[n,c]=l.useState(null),[d,o]=l.useState(null),[m,x]=l.useState(!1),[u,h]=l.useState(null),y=async s=>{var r,a;s.preventDefault();try{o(null),x(!0),h(null);const t=await p.post("/admin/remitter2/queryRemitter",{mobile:i});t.data.success?(c(t.data.data),await N(t.data.data)):(o(t.data.message||"Failed to fetch data"),c(null))}catch(t){o(((a=(r=t.response)==null?void 0:r.data)==null?void 0:a.message)||"An error occurred"),c(null)}finally{x(!1)}},N=async s=>{var r,a;try{(await p.post("/admin/remitter2/storeRemitter",{mobile:i,limit:s.limit||0})).data.success&&h("Remitter data saved successfully")}catch(t){o(((a=(r=t.response)==null?void 0:r.data)==null?void 0:a.message)||"Failed to save remitter data")}},w=s=>typeof s=="object"&&s!==null?JSON.stringify(s):s;return e.jsx(v,{children:e.jsx("div",{className:"max-w-full",children:e.jsxs("div",{className:"bg-white rounded-xl shadow-md overflow-hidden border border-gray-100",children:[e.jsx("div",{className:"bg-gradient-to-tr from-gray-400 to-black py-4 px-6",children:e.jsx("h2",{className:"text-3xl font-semibold text-white",children:"Query Remitter"})}),e.jsxs("form",{onSubmit:y,className:"p-6",children:[e.jsx("div",{className:"grid grid-cols-1 gap-6 mb-6",children:e.jsxs("div",{children:[e.jsxs("label",{htmlFor:"mobile",className:"flex items-center text-sm font-medium text-gray-600 mb-1",children:[e.jsx(T,{size:20,className:"mr-2 text-yellow-500"}),"Mobile Number"]}),e.jsx("input",{id:"mobile",type:"text",value:i,onChange:s=>j(s.target.value),className:"w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all",required:!0,placeholder:"Enter mobile number",maxLength:10})]})}),e.jsx("button",{type:"submit",disabled:m||!i,className:"w-full bg-gray-800 text-white py-3 px-4 rounded-lg hover:bg-black focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium",children:m?e.jsxs("span",{className:"flex items-center justify-center",children:[e.jsxs("svg",{className:"animate-spin -ml-1 mr-2 h-4 w-4 text-white",xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24",children:[e.jsx("circle",{className:"opacity-25",cx:"12",cy:"12",r:"10",stroke:"currentColor",strokeWidth:"4"}),e.jsx("path",{className:"opacity-75",fill:"currentColor",d:"M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"})]}),"Searching..."]}):"Search Remitter"})]}),e.jsxs("div",{className:"px-6 pb-6",children:[d&&e.jsx("div",{className:"mt-4 p-4 bg-red-50 border border-red-100 rounded-lg",children:e.jsxs("p",{className:"text-red-600 text-sm flex items-center",children:[e.jsx(k,{size:16,className:"mr-2"}),d]})}),u&&e.jsx("div",{className:"mt-4 p-4 bg-green-50 border border-green-100 rounded-lg",children:e.jsxs("p",{className:"text-green-600 text-sm flex items-center",children:[e.jsx(z,{size:16,className:"mr-2"}),u]})}),n&&e.jsxs("div",{className:"mt-4",children:[e.jsxs("h3",{className:"font-medium text-sm text-gray-700 mb-2 flex items-center",children:[e.jsx(A,{size:16,className:"mr-2"}),"Remitter Information:"]}),e.jsx("div",{className:"border border-gray-200 rounded-lg shadow-md overflow-hidden",children:e.jsxs(S,{className:"w-full border-collapse",children:[e.jsx(C,{className:"bg-sky-500 text-white",children:e.jsxs(b,{children:[e.jsx(f,{className:"px-4 py-2 text-left",children:"Field"}),e.jsx(f,{className:"px-4 py-2 text-left",children:"Value"})]})}),e.jsx(R,{children:Object.entries(n).map(([s,r])=>e.jsxs(b,{className:"border-b border-gray-200",children:[e.jsx(g,{className:"px-4 py-2 font-medium",children:s}),e.jsx(g,{className:"px-4 py-2",children:w(r)})]},s))})]})})]}),!n&&!d&&!m&&e.jsx("p",{className:"text-gray-500 text-sm italic",children:"Enter a mobile number and click search to view remitter details"})]})]})})})};export{Q as default};
