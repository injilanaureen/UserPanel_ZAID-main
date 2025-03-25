import{r as a,j as e,a as P}from"./app-DJa97arl.js";import{A as C,U as S}from"./AdminLayout-BAUsXvD1.js";import"./table-BU4XrRMv.js";import{H as N}from"./hash-BO4OmkRd.js";import{c as k}from"./createLucideIcon-0J5g5tHA.js";import{C as A}from"./circle-alert-GLVn6Z4_.js";import{C as D}from"./circle-check-big-5_tSTUL5.js";import{M}from"./map-pin-vNjXDYYA.js";import{P as _}from"./phone-CjaA0ELW.js";import"./x-BxSEnrvq.js";import"./log-out-CuD3j2sV.js";import"./utils-CiMRq3MP.js";import"./clsx-B-dksMZM.js";/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const L=[["line",{x1:"3",x2:"21",y1:"22",y2:"22",key:"j8o0r"}],["line",{x1:"6",x2:"6",y1:"18",y2:"11",key:"10tf0k"}],["line",{x1:"10",x2:"10",y1:"18",y2:"11",key:"54lgf6"}],["line",{x1:"14",x2:"14",y1:"18",y2:"11",key:"380y"}],["line",{x1:"18",x2:"18",y1:"18",y2:"11",key:"1kevvc"}],["polygon",{points:"12 2 20 7 4 7",key:"jkujk7"}]],E=k("Landmark",L);/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const F=[["path",{d:"M14.106 5.553a2 2 0 0 0 1.788 0l3.659-1.83A1 1 0 0 1 21 4.619v12.764a1 1 0 0 1-.553.894l-4.553 2.277a2 2 0 0 1-1.788 0l-4.212-2.106a2 2 0 0 0-1.788 0l-3.659 1.83A1 1 0 0 1 3 19.381V6.618a1 1 0 0 1 .553-.894l4.553-2.277a2 2 0 0 1 1.788 0z",key:"169xi5"}],["path",{d:"M15 5.764v15",key:"1pn4in"}],["path",{d:"M9 3.236v15",key:"1uimfh"}]],v=k("Map",F),Y=()=>{var b;const[c,I]=a.useState(""),[d,w]=a.useState(""),[r,m]=a.useState(null),[p,x]=a.useState(!1),[u,i]=a.useState(""),[g,f]=a.useState(""),[T,h]=a.useState(null),z=async()=>{var s,n,o,y,j;x(!0),i(""),f(""),m(null),h(null);try{const t=(await P.post("/admin/busTicket/fetchboardingpointdetails",{bpId:parseInt(c,10),trip_id:d},{headers:{Accept:"application/json","Content-Type":"application/json"}})).data;console.log("API Response:",t),h(t),t.success&&((s=t.api_response)!=null&&s.data)&&typeof t.api_response.data=="object"?(m(t.api_response.data),f("Boarding point fetched successfully!")):i(t.message||"Failed to fetch boarding point")}catch(l){console.error("Error:",l);const t=((o=(n=l.response)==null?void 0:n.data)==null?void 0:o.message)||((j=(y=l.response)==null?void 0:y.data)==null?void 0:j.errors)||"Failed to fetch boarding point";i(typeof t=="object"?JSON.stringify(t):t)}finally{x(!1)}},B=s=>{s.preventDefault(),c&&d?z():i("Both BP ID and Trip ID are required")};return e.jsx(C,{children:e.jsx("div",{className:"max-w-full",children:e.jsxs("div",{className:"bg-white rounded-xl shadow-md overflow-hidden border border-gray-100",children:[e.jsx("div",{className:"bg-gradient-to-tr from-gray-400 to-black py-4 px-6",children:e.jsx("h2",{className:"text-3xl font-semibold text-white",children:"Boarding Point Details"})}),e.jsxs("form",{onSubmit:B,className:"p-6",children:[e.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-2 gap-6 mb-6",children:[e.jsxs("div",{children:[e.jsxs("label",{htmlFor:"bpId",className:"flex items-center text-sm font-medium text-gray-600 mb-1",children:[e.jsx(N,{size:20,className:"mr-2 text-blue-500"}),"BP ID"]}),e.jsx("input",{id:"bpId",type:"number",value:c,onChange:s=>I(s.target.value),className:"w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all",placeholder:"Enter BP ID",required:!0})]}),e.jsxs("div",{children:[e.jsxs("label",{htmlFor:"tripId",className:"flex items-center text-sm font-medium text-gray-600 mb-1",children:[e.jsx(v,{size:20,className:"mr-2 text-blue-500"}),"Trip ID"]}),e.jsx("input",{id:"tripId",type:"text",value:d,onChange:s=>w(s.target.value),className:"w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all",placeholder:"Enter Trip ID",required:!0})]})]}),e.jsx("button",{type:"submit",disabled:p,className:"w-full bg-gray-800 text-white py-3 px-4 rounded-lg hover:bg-black focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium",children:p?e.jsxs("span",{className:"flex items-center justify-center",children:[e.jsxs("svg",{className:"animate-spin -ml-1 mr-2 h-4 w-4 text-white",xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24",children:[e.jsx("circle",{className:"opacity-25",cx:"12",cy:"12",r:"10",stroke:"currentColor",strokeWidth:"4"}),e.jsx("path",{className:"opacity-75",fill:"currentColor",d:"M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"})]}),"Fetching..."]}):"Fetch Boarding Point"})]}),e.jsxs("div",{className:"px-6 pb-6",children:[u&&e.jsx("div",{className:"mt-4 p-4 bg-red-50 border border-red-100 rounded-lg",children:e.jsxs("p",{className:"text-red-600 text-sm flex items-center",children:[e.jsx(A,{size:16,className:"mr-2"}),u]})}),g&&e.jsx("div",{className:"mt-4 p-4 bg-green-50 border border-green-100 rounded-lg",children:e.jsxs("p",{className:"text-green-600 text-sm flex items-center",children:[e.jsx(D,{size:16,className:"mr-2"}),g]})}),r&&e.jsxs("div",{className:"mt-6 p-6 bg-gray-50 border border-gray-200 rounded-lg",children:[e.jsx("h3",{className:"text-xl font-semibold text-gray-800 mb-4",children:r.name}),e.jsxs("div",{className:"space-y-3 text-gray-600",children:[e.jsxs("p",{className:"flex items-center",children:[e.jsx(N,{size:16,className:"mr-2 text-blue-500"}),"ID: ",r.id]}),e.jsxs("p",{className:"flex items-center",children:[e.jsx(v,{size:16,className:"mr-2 text-blue-500"}),"Location: ",r.locationName]}),e.jsxs("p",{className:"flex items-center",children:[e.jsx(M,{size:16,className:"mr-2 text-blue-500"}),"Address: ",r.address]}),e.jsxs("p",{className:"flex items-center",children:[e.jsx(_,{size:16,className:"mr-2 text-blue-500"}),"Contact: ",(b=r.contactnumber)==null?void 0:b.split(",").map(s=>s.trim()).filter((s,n,o)=>o.indexOf(s)===n).join(", ")]}),e.jsxs("p",{className:"flex items-center",children:[e.jsx(E,{size:16,className:"mr-2 text-blue-500"}),"Landmark: ",r.landmark]}),e.jsxs("p",{className:"flex items-center",children:[e.jsx(S,{size:16,className:"mr-2 text-blue-500"}),"Name: ",r.name]})]})]})]})]})})})};export{Y as default};
