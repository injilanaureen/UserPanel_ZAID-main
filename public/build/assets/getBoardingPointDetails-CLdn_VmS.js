import{r as o,j as e}from"./app-C9Hasp1L.js";import{A as g,U as f}from"./AdminLayout-dj7iNOPP.js";import{H as k}from"./hash-DDqCTCbj.js";import{c as d}from"./createLucideIcon-BHfLX7CN.js";import{M as j}from"./map-pin-xLXA-7Tp.js";import{P as N}from"./phone-CjpF7r30.js";import"./x-o7aJ_J0I.js";/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const w=[["rect",{width:"16",height:"20",x:"4",y:"2",rx:"2",ry:"2",key:"76otgf"}],["path",{d:"M9 22v-4h6v4",key:"r93iot"}],["path",{d:"M8 6h.01",key:"1dz90k"}],["path",{d:"M16 6h.01",key:"1x0f13"}],["path",{d:"M12 6h.01",key:"1vi96p"}],["path",{d:"M12 10h.01",key:"1nrarc"}],["path",{d:"M12 14h.01",key:"1etili"}],["path",{d:"M16 10h.01",key:"1m94wz"}],["path",{d:"M16 14h.01",key:"1gbofw"}],["path",{d:"M8 10h.01",key:"19clt8"}],["path",{d:"M8 14h.01",key:"6423bh"}]],I=d("Building",w);/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const M=[["line",{x1:"3",x2:"21",y1:"22",y2:"22",key:"j8o0r"}],["line",{x1:"6",x2:"6",y1:"18",y2:"11",key:"10tf0k"}],["line",{x1:"10",x2:"10",y1:"18",y2:"11",key:"54lgf6"}],["line",{x1:"14",x2:"14",y1:"18",y2:"11",key:"380y"}],["line",{x1:"18",x2:"18",y1:"18",y2:"11",key:"1kevvc"}],["polygon",{points:"12 2 20 7 4 7",key:"jkujk7"}]],v=d("Landmark",M);/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const P=[["path",{d:"M14.106 5.553a2 2 0 0 0 1.788 0l3.659-1.83A1 1 0 0 1 21 4.619v12.764a1 1 0 0 1-.553.894l-4.553 2.277a2 2 0 0 1-1.788 0l-4.212-2.106a2 2 0 0 0-1.788 0l-3.659 1.83A1 1 0 0 1 3 19.381V6.618a1 1 0 0 1 .553-.894l4.553-2.277a2 2 0 0 1 1.788 0z",key:"169xi5"}],["path",{d:"M15 5.764v15",key:"1pn4in"}],["path",{d:"M9 3.236v15",key:"1uimfh"}]],B=d("Map",P),q=()=>{const[r,m]=o.useState(""),[i,x]=o.useState(""),[t,p]=o.useState(null),[l,h]=o.useState(!1),[_,a]=o.useState(null),[A,u]=o.useState(null),y=async()=>{var n;h(!0),a(null),p(null),u(null);try{const s=(await axios.post("/admin/busTicket/fetchboardingpointdetails",{bpId:parseInt(r,10),trip_id:parseInt(i,10)},{headers:{Accept:"application/json","Content-Type":"application/json"}})).data;if(console.log("API Response:",s),!s||typeof s!="object")throw new Error("Invalid API response format");u({status:(s==null?void 0:s.status)??!1,responseCode:(s==null?void 0:s.response_code)??"No response code",errorMsg:typeof(s==null?void 0:s.data)=="string"?s.data:"No specific error"}),s.success&&((n=s.api_response)!=null&&n.data)&&typeof s.api_response.data=="object"?p(s.api_response.data):a(s.message||"Unknown error from API")}catch(c){console.error("Error:",c),a(c.message||"Failed to fetch boarding point")}finally{h(!1)}},b=n=>{n.preventDefault(),r&&i?y():a("Both BP ID and Trip ID are required")};return e.jsx(g,{children:e.jsxs("div",{className:"max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg",children:[e.jsx("h1",{className:"text-2xl font-bold mb-6 text-center",children:"Boarding Point Details"}),e.jsxs("form",{onSubmit:b,className:"mb-4 space-y-4",children:[e.jsxs("div",{children:[e.jsx("label",{className:"block text-sm font-medium text-gray-700",children:"BP ID:"}),e.jsx("input",{type:"number",value:r,onChange:n=>m(n.target.value),className:"mt-1 block w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500",required:!0})]}),e.jsxs("div",{children:[e.jsx("label",{className:"block text-sm font-medium text-gray-700",children:"Trip ID:"}),e.jsx("input",{type:"number",value:i,onChange:n=>x(n.target.value),className:"mt-1 block w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500",required:!0})]}),e.jsx("button",{type:"submit",disabled:l,className:`w-full px-4 py-2 text-white rounded transition-colors ${l?"bg-blue-300":"bg-blue-500 hover:bg-blue-600"}`,children:l?"Loading...":"Fetch Boarding Point"})]}),t&&e.jsxs("div",{className:"mt-6 p-4 bg-gray-50 rounded-lg space-y-4",children:[e.jsx("h2",{className:"text-xl font-bold text-gray-800",children:t.name}),e.jsxs("p",{children:[e.jsx(k,{className:"inline-block w-5 h-5 text-gray-500"})," ID: ",t.id]}),e.jsxs("p",{children:[e.jsx(B,{className:"inline-block w-5 h-5 text-gray-500"})," Location: ",t.locationName]}),e.jsxs("p",{children:[e.jsx(j,{className:"inline-block w-5 h-5 text-gray-500"})," Address: ",t.address]}),e.jsxs("p",{children:[e.jsx(N,{className:"inline-block w-5 h-5 text-gray-500"})," Contact: ",t.contactnumber]}),e.jsxs("p",{children:[e.jsx(v,{className:"inline-block w-5 h-5 text-gray-500"})," Landmark: ",t.landmark]}),e.jsxs("p",{children:[e.jsx(f,{className:"inline-block w-5 h-5 text-gray-500"})," Name: ",t.name]}),e.jsxs("p",{children:[e.jsx(I,{className:"inline-block w-5 h-5 text-gray-500"})," RB Master ID: ",t.rbMasterId]})]})]})})};export{q as default};
