import{r as c,j as e,a as F}from"./app-DJa97arl.js";import{A as B}from"./AdminLayout-BAUsXvD1.js";import{T as z,a as E,b as A,c as v,d as S,e as C}from"./table-BU4XrRMv.js";import{P as M}from"./phone-CjaA0ELW.js";import{M as T}from"./mail-k6mcDVQp.js";import{C as _}from"./calendar-CYznx0js.js";import{C as I}from"./circle-check-big-5_tSTUL5.js";import{C as k}from"./circle-alert-GLVn6Z4_.js";import{C as q}from"./code-BMyiWB5B.js";import"./x-BxSEnrvq.js";import"./createLucideIcon-0J5g5tHA.js";import"./log-out-CuD3j2sV.js";import"./utils-CiMRq3MP.js";import"./clsx-B-dksMZM.js";const Z=()=>{var b,g,p,y,N,j,w;const[n,m]=c.useState({canumber:"",ad1:"",ad2:"",mode:"online"}),[x,u]=c.useState(!1),[f,o]=c.useState(null),[a,h]=c.useState(null),d=t=>{const{name:r,value:i}=t.target;if(r==="ad2"){let s=i.replace(/[^0-9/]/g,"");(s.length===2||s.length===5)&&(s.endsWith("/")||(s+="/")),s.length>10&&(s=s.slice(0,10)),m(l=>({...l,[r]:s}))}else m(s=>({...s,[r]:i}));o(null)},P=async t=>{var i,s;if(t.preventDefault(),u(!0),o(null),h(null),!/^(\d{2})\/(\d{2})\/(\d{4})$/.test(n.ad2)){o("Please enter the date in dd/mm/yyyy format."),u(!1);return}try{const l=await F.post("/admin/InsurancePremiumPayment/fetch-lic-bill",n);console.log("Full API Response:",l),console.log("API Response:",l.data),h(l.data),l.data.status&&m({canumber:"",ad1:"",ad2:"",mode:"offline"})}catch(l){const D=((s=(i=l.response)==null?void 0:i.data)==null?void 0:s.message)||"Failed to fetch bill details";o(D)}finally{u(!1)}};return e.jsx(B,{children:e.jsx("div",{className:"max-w-full",children:e.jsxs("div",{className:"bg-white rounded-xl shadow-md overflow-hidden border border-gray-100",children:[e.jsx("div",{className:"bg-gradient-to-tr from-gray-400 to-black py-4 px-6",children:e.jsx("h2",{className:"text-3xl font-semibold text-white",children:"Fetch Insurance Bill Details"})}),e.jsxs("form",{onSubmit:P,className:"p-6",children:[e.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-2 gap-6 mb-6",children:[e.jsxs("div",{children:[e.jsxs("label",{htmlFor:"canumber",className:"flex items-center text-sm font-medium text-gray-600 mb-1",children:[e.jsx(M,{size:20,className:"mr-2 text-yellow-500"}),"CA Number"]}),e.jsx("input",{id:"canumber",type:"number",name:"canumber",value:n.canumber,onChange:d,className:"w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all",required:!0,placeholder:"Enter CA Number"})]}),e.jsxs("div",{children:[e.jsxs("label",{htmlFor:"ad1",className:"flex items-center text-sm font-medium text-gray-600 mb-1",children:[e.jsx(T,{size:20,className:"mr-2 text-blue-500"}),"Email"]}),e.jsx("input",{id:"ad1",type:"email",name:"ad1",value:n.ad1,onChange:d,className:"w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all",required:!0,placeholder:"Enter Email"})]}),e.jsxs("div",{children:[e.jsxs("label",{htmlFor:"ad2",className:"flex items-center text-sm font-medium text-gray-600 mb-1",children:[e.jsx(_,{size:20,className:"mr-2 text-green-500"}),"Date (dd/mm/yyyy)"]}),e.jsx("input",{id:"ad2",type:"text",name:"ad2",value:n.ad2,onChange:d,placeholder:"dd/mm/yyyy",className:"w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all",required:!0})]}),e.jsxs("div",{children:[e.jsxs("label",{htmlFor:"mode",className:"flex items-center text-sm font-medium text-gray-600 mb-1",children:[e.jsx(I,{size:20,className:"mr-2 text-purple-500"}),"Mode"]}),e.jsxs("select",{id:"mode",name:"mode",value:n.mode,onChange:d,className:"w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all",required:!0,children:[e.jsx("option",{value:"online",children:"Online"}),e.jsx("option",{value:"offline",children:"Offline"})]})]})]}),e.jsx("button",{type:"submit",disabled:x,className:"w-full bg-gray-800 text-white py-3 px-4 rounded-lg hover:bg-black focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium",children:x?e.jsxs("span",{className:"flex items-center justify-center",children:[e.jsxs("svg",{className:"animate-spin -ml-1 mr-2 h-4 w-4 text-white",xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24",children:[e.jsx("circle",{className:"opacity-25",cx:"12",cy:"12",r:"10",stroke:"currentColor",strokeWidth:"4"}),e.jsx("path",{className:"opacity-75",fill:"currentColor",d:"M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"})]}),"Fetching..."]}):"Fetch Bill Details"})]}),e.jsxs("div",{className:"px-6 pb-6",children:[f&&e.jsx("div",{className:"mt-4 p-4 bg-red-50 border border-red-100 rounded-lg",children:e.jsxs("p",{className:"text-red-600 text-sm flex items-center",children:[e.jsx(k,{size:16,className:"mr-2"}),f]})}),a&&e.jsxs("div",{className:"mt-4",children:[e.jsxs("h3",{className:"font-medium text-sm text-gray-700 mb-2 flex items-center",children:[e.jsx(q,{size:16,className:"mr-2"}),"Bill Details:"]}),e.jsx("div",{className:"border border-gray-200 rounded-lg shadow-md overflow-hidden",children:e.jsxs(z,{className:"w-full border-collapse",children:[e.jsx(E,{className:"bg-sky-500 text-white",children:e.jsxs(A,{children:[e.jsx(v,{className:"px-4 py-2 text-left",children:"Key"}),e.jsx(v,{className:"px-4 py-2 text-left",children:"Value"})]})}),e.jsx(S,{children:Object.entries({"Customer Name":a.name||"N/A","Bill Amount":((b=a.bill_fetch)==null?void 0:b.billAmount)||"N/A","Net Amount":((g=a.bill_fetch)==null?void 0:g.billnetamount)||"N/A","Due Date":((p=a.bill_fetch)==null?void 0:p.dueDate)||"N/A","Max Bill Amount":((y=a.bill_fetch)==null?void 0:y.maxBillAmount)||"N/A","Accept Payment":(N=a.bill_fetch)!=null&&N.acceptPayment?"Yes":"No","Accept Part Pay":(j=a.bill_fetch)!=null&&j.acceptPartPay?"Yes":"No","Cell Number":((w=a.bill_fetch)==null?void 0:w.cellNumber)||"N/A","Email (ad1)":a.ad1||"N/A","Additional Field (ad2)":a.ad2||"N/A","Status Message":a.message||"N/A"}).map(([t,r])=>e.jsxs(A,{className:"border-b border-gray-200",children:[e.jsx(C,{className:"px-4 py-2 font-medium",children:t}),e.jsx(C,{className:`px-4 py-2 ${t.includes("Accept")?r==="Yes"?"text-green-600":"text-red-600":""}`,children:String(r)})]},t))})]})})]})]})]})})})};export{Z as default};
