import{r as i,j as e,a as m}from"./app-C9Hasp1L.js";import{A as k}from"./AdminLayout-dj7iNOPP.js";import"./x-o7aJ_J0I.js";import"./createLucideIcon-BHfLX7CN.js";const E=()=>{const[u,x]=i.useState(!1),[p,h]=i.useState(null),[b,n]=i.useState(null),[o,y]=i.useState([]),[r,N]=i.useState({canumber:"",operator:""});i.useEffect(()=>{(async()=>{try{const s=await m.post(route("municipality.fetch"),{mode:"online"});s.data&&s.data.data?y(s.data.data):console.error("Unexpected API response format:",s.data)}catch(s){console.error("Error fetching municipalities:",s)}})()},[]);const g=t=>{N({...r,[t.target.name]:t.target.value})},v=async t=>{var s,l,f,j,w;t.preventDefault(),x(!0),n(null),h(null),console.log("User input data:",r);try{const a=(await m.post("/api/municipality/fetch-bill",r)).data;console.log("Bill data from fetch:",a),h(a);const M={ca_number:r.canumber,operator_id:r.operator,name:a.name||"Unknown",amount:parseInt(a.amount,10)||0,response_code:parseInt(a.response_code||a.responseCode,10)||0,status:typeof a.status=="boolean"?a.status:a.status==="success"||a.status==="true",message:a.message||"No message provided"};try{await m.post("/municipality/save-bill",M),console.log("Bill data saved successfully")}catch(d){console.error("Error saving bill data:",d),console.log("Error details:",(s=d.response)==null?void 0:s.data),n(((f=(l=d.response)==null?void 0:l.data)==null?void 0:f.message)||"Failed to save bill details")}}catch(c){console.error("Error fetching bill details:",c),n(((w=(j=c.response)==null?void 0:j.data)==null?void 0:w.message)||"Failed to fetch bill details")}finally{x(!1)}},C=t=>{const s=o.find(l=>l.id.toString()===t.toString());return s?s.name:"Unknown Municipality"};return e.jsx(k,{children:e.jsx("div",{className:"p-6 bg-gray-50",children:e.jsxs("div",{className:"bg-white rounded-xl shadow-lg p-8 max-w-4xl mx-auto",children:[e.jsx("h2",{className:"text-3xl font-bold mb-8 text-blue-700 border-b pb-4",children:"Fetch Municipality Details"}),e.jsxs("form",{onSubmit:v,className:"space-y-6",children:[e.jsxs("div",{className:"space-y-2",children:[e.jsx("label",{htmlFor:"canumber",className:"block text-sm font-medium text-gray-700",children:"CA Number"}),e.jsx("input",{id:"canumber",type:"text",name:"canumber",placeholder:"Enter CA Number",value:r.canumber,onChange:g,required:!0,className:"w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"})]}),e.jsxs("div",{className:"space-y-2",children:[e.jsx("label",{htmlFor:"operator",className:"block text-sm font-medium text-gray-700",children:"Operator"}),e.jsxs("select",{id:"operator",name:"operator",value:r.operator,onChange:g,required:!0,className:"w-full px-4 py-3 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200",children:[e.jsx("option",{value:"",children:"Select Operator"}),o.length>0?o.map(t=>e.jsx("option",{value:t.id,children:t.name},t.id)):e.jsx("option",{disabled:!0,children:"Loading municipalities..."})]})]}),e.jsx("button",{type:"submit",disabled:u,className:"w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed transition-colors duration-200 font-medium mt-4 shadow-md",children:u?e.jsxs("span",{className:"flex items-center justify-center",children:[e.jsxs("svg",{className:"animate-spin -ml-1 mr-3 h-5 w-5 text-white",xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24",children:[e.jsx("circle",{className:"opacity-25",cx:"12",cy:"12",r:"10",stroke:"currentColor",strokeWidth:"4"}),e.jsx("path",{className:"opacity-75",fill:"currentColor",d:"M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"})]}),"Fetching..."]}):"Fetch Details"})]}),b&&e.jsx("div",{className:"mt-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-md",children:e.jsxs("div",{className:"flex",children:[e.jsx("div",{className:"flex-shrink-0",children:e.jsx("svg",{className:"h-5 w-5 text-red-500",xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 20 20",fill:"currentColor",children:e.jsx("path",{fillRule:"evenodd",d:"M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z",clipRule:"evenodd"})})}),e.jsx("div",{className:"ml-3",children:e.jsx("p",{className:"text-sm font-medium",children:b})})]})}),p&&e.jsxs("div",{className:"mt-8 bg-gray-50 rounded-lg p-6 border border-gray-200",children:[e.jsxs("h3",{className:"text-xl font-semibold mb-6 text-gray-800 flex items-center",children:[e.jsx("svg",{className:"h-6 w-6 text-blue-600 mr-2",xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24",stroke:"currentColor",children:e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"})}),"Bill Details"]}),e.jsx("div",{className:"mb-6 bg-blue-50 p-4 rounded-md border border-blue-100",children:e.jsxs("div",{className:"flex items-center",children:[e.jsx("div",{className:"flex-shrink-0",children:e.jsx("svg",{className:"h-5 w-5 text-blue-500",xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 20 20",fill:"currentColor",children:e.jsx("path",{fillRule:"evenodd",d:"M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9a1 1 0 00-1-1z",clipRule:"evenodd"})})}),e.jsxs("div",{className:"ml-3",children:[e.jsxs("p",{className:"text-sm font-medium text-blue-800",children:["Operator: ",e.jsx("span",{className:"font-bold",children:C(r.operator)})]}),e.jsxs("p",{className:"text-sm text-blue-700",children:["CA Number: ",e.jsx("span",{className:"font-mono",children:r.canumber})]})]})]})}),e.jsx("div",{className:"overflow-hidden shadow-sm border border-gray-200 sm:rounded-lg",children:e.jsxs("table",{className:"min-w-full divide-y divide-gray-200",children:[e.jsx("thead",{className:"bg-gray-100",children:e.jsxs("tr",{children:[e.jsx("th",{scope:"col",className:"px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider",children:"Field"}),e.jsx("th",{scope:"col",className:"px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider",children:"Value"})]})}),e.jsx("tbody",{className:"bg-white divide-y divide-gray-200",children:Object.entries(p).map(([t,s],l)=>e.jsxs("tr",{className:l%2===0?"bg-white":"bg-gray-50",children:[e.jsx("td",{className:"px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-700",children:t.replace(/_/g," ").toUpperCase()}),e.jsx("td",{className:"px-6 py-4 whitespace-nowrap text-sm text-gray-500",children:typeof s=="boolean"?s?e.jsxs("span",{className:"inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800",children:[e.jsx("svg",{className:"-ml-0.5 mr-1.5 h-3 w-3 text-green-500",fill:"currentColor",viewBox:"0 0 12 12",children:e.jsx("path",{d:"M4 8l2 2 4-4m.535-2.857a7 7 0 11-9.9 9.9 7 7 0 019.9-9.9z"})}),"Yes"]}):e.jsxs("span",{className:"inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800",children:[e.jsx("svg",{className:"-ml-0.5 mr-1.5 h-3 w-3 text-red-500",fill:"currentColor",viewBox:"0 0 12 12",children:e.jsx("path",{d:"M10 2.5L7.5 5 10 7.5 7.5 10 5 7.5 2.5 10 0 7.5 2.5 5 0 2.5 2.5 0 5 2.5 7.5 0 10 2.5z"})}),"No"]}):s!=null?s.toString():"—"})]},t))})]})})]})]})})})};export{E as default};
