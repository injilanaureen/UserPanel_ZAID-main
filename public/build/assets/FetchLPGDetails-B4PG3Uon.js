import{r as l,m as z,a as E,j as e}from"./app-DJa97arl.js";import{A as L}from"./AdminLayout-BAUsXvD1.js";import{T as P,a as T,b as y,c as N,d as A,e as v}from"./table-BU4XrRMv.js";import{S as D}from"./signal-B26zu_Os.js";import{P as d}from"./phone-CjaA0ELW.js";import{C as G}from"./circle-alert-GLVn6Z4_.js";import{C as k}from"./circle-check-big-5_tSTUL5.js";import{C as q}from"./code-BMyiWB5B.js";import"./x-BxSEnrvq.js";import"./createLucideIcon-0J5g5tHA.js";import"./log-out-CuD3j2sV.js";import"./utils-CiMRq3MP.js";import"./clsx-B-dksMZM.js";const Y=({lpgData:x})=>{const[u,_]=l.useState([]),[g,o]=l.useState(!1),[s,w]=l.useState(null),[h,i]=l.useState(""),[f,c]=l.useState(""),{data:t,setData:p,post:C,processing:b}=z({operator:"",canumber:"",ad1:"",ad2:"",ad3:""});l.useEffect(()=>{F()},[]);const F=async()=>{o(!0);try{const a=await E.post("/api/fetch-lpg-operator",{mode:"offline"});_(a.data.data||[])}catch(a){console.error("Error fetching operators:",a),i("Failed to fetch operators")}o(!1)},n=(a,r)=>{if(p(a,r),i(""),c(""),a==="operator"){const j=u.find(m=>m.id===r);w(j),j&&p(m=>({...m,operator:r,ad1:"",ad2:"",ad3:""}))}},S=a=>{a.preventDefault(),console.log("User Input data:",t),o(!0),i(""),c(""),C(route("LPG.FetchLPGDetails"),{onSuccess:()=>{c("LPG details fetched successfully!")},onError:r=>{i(r.message||"Failed to fetch LPG details")},onFinish:()=>o(!1)})};return e.jsx(L,{children:e.jsx("div",{className:"max-w-full",children:e.jsxs("div",{className:"bg-white rounded-xl shadow-md overflow-hidden border border-gray-100",children:[e.jsx("div",{className:"bg-gradient-to-tr from-gray-400 to-black py-4 px-6",children:e.jsx("h2",{className:"text-3xl font-semibold text-white",children:"Fetch LPG Bill Details"})}),e.jsxs("form",{onSubmit:S,className:"p-6",children:[e.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-2 gap-6 mb-6",children:[e.jsxs("div",{children:[e.jsxs("label",{htmlFor:"operator",className:"flex items-center text-sm font-medium text-gray-600 mb-1",children:[e.jsx(D,{size:20,className:"mr-2 text-green-500"}),"Operator"]}),e.jsxs("select",{id:"operator",value:t.operator,onChange:a=>n("operator",a.target.value),className:"w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all",required:!0,children:[e.jsx("option",{value:"",children:"Select Operator"}),u.map(a=>e.jsx("option",{value:a.id,children:a.name},a.id))]})]}),e.jsxs("div",{children:[e.jsxs("label",{htmlFor:"canumber",className:"flex items-center text-sm font-medium text-gray-600 mb-1",children:[e.jsx(d,{size:20,className:"mr-2 text-yellow-500"}),"CA Number"]}),e.jsx("input",{id:"canumber",type:"text",value:t.canumber,onChange:a=>n("canumber",a.target.value),className:"w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all",required:!0,placeholder:(s==null?void 0:s.displayname)||"Enter CA Number"}),(s==null?void 0:s.regex)&&e.jsxs("p",{className:"text-xs text-gray-500 mt-1",children:["Format: ",s.regex]})]}),(s==null?void 0:s.ad1_d_name)&&e.jsxs("div",{children:[e.jsxs("label",{htmlFor:"ad1",className:"flex items-center text-sm font-medium text-gray-600 mb-1",children:[e.jsx(d,{size:20,className:"mr-2 text-blue-500"}),s.ad1_d_name]}),e.jsx("input",{id:"ad1",type:"text",value:t.ad1,onChange:a=>n("ad1",a.target.value),className:"w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all",required:!0,placeholder:`Enter ${s.ad1_d_name}`}),(s==null?void 0:s.ad1_regex)&&e.jsxs("p",{className:"text-xs text-gray-500 mt-1",children:["Format: ",s.ad1_regex]})]}),(s==null?void 0:s.ad2_d_name)&&e.jsxs("div",{children:[e.jsxs("label",{htmlFor:"ad2",className:"flex items-center text-sm font-medium text-gray-600 mb-1",children:[e.jsx(d,{size:20,className:"mr-2 text-blue-500"}),s.ad2_d_name]}),e.jsx("input",{id:"ad2",type:"text",value:t.ad2,onChange:a=>n("ad2",a.target.value),className:"w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all",required:!!(s!=null&&s.ad2_d_name),placeholder:`Enter ${s.ad2_d_name}`}),(s==null?void 0:s.ad2_regex)&&e.jsxs("p",{className:"text-xs text-gray-500 mt-1",children:["Format: ",s.ad2_regex]})]}),(s==null?void 0:s.ad3_d_name)&&e.jsxs("div",{children:[e.jsxs("label",{htmlFor:"ad3",className:"flex items-center text-sm font-medium text-gray-600 mb-1",children:[e.jsx(d,{size:20,className:"mr-2 text-blue-500"}),s.ad3_d_name]}),e.jsx("input",{id:"ad3",type:"text",value:t.ad3,onChange:a=>n("ad3",a.target.value),className:"w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all",required:!!(s!=null&&s.ad3_d_name),placeholder:`Enter ${s.ad3_d_name}`}),(s==null?void 0:s.ad3_regex)&&e.jsxs("p",{className:"text-xs text-gray-500 mt-1",children:["Format: ",s.ad3_regex]})]})]}),e.jsx("button",{type:"submit",disabled:g||b,className:"w-full bg-gray-800 text-white py-3 px-4 rounded-lg hover:bg-black focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium",children:g||b?e.jsxs("span",{className:"flex items-center justify-center",children:[e.jsxs("svg",{className:"animate-spin -ml-1 mr-2 h-4 w-4 text-white",xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24",children:[e.jsx("circle",{className:"opacity-25",cx:"12",cy:"12",r:"10",stroke:"currentColor",strokeWidth:"4"}),e.jsx("path",{className:"opacity-75",fill:"currentColor",d:"M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"})]}),"Fetching..."]}):"Fetch Details"})]}),e.jsxs("div",{className:"px-6 pb-6",children:[h&&e.jsx("div",{className:"mt-4 p-4 bg-red-50 border border-red-100 rounded-lg",children:e.jsxs("p",{className:"text-red-600 text-sm flex items-center",children:[e.jsx(G,{size:16,className:"mr-2"}),h]})}),f&&e.jsx("div",{className:"mt-4 p-4 bg-green-50 border border-green-100 rounded-lg",children:e.jsxs("p",{className:"text-green-600 text-sm flex items-center",children:[e.jsx(k,{size:16,className:"mr-2"}),f]})}),x&&e.jsxs("div",{className:"mt-4",children:[e.jsxs("h3",{className:"font-medium text-sm text-gray-700 mb-2 flex items-center",children:[e.jsx(q,{size:16,className:"mr-2"}),"Bill Details:"]}),e.jsx("div",{className:"border border-gray-200 rounded-lg shadow-md overflow-hidden",children:e.jsxs(P,{className:"w-full border-collapse",children:[e.jsx(T,{className:"bg-sky-500 text-white",children:e.jsxs(y,{children:[e.jsx(N,{className:"px-4 py-2 text-left",children:"Key"}),e.jsx(N,{className:"px-4 py-2 text-left",children:"Value"})]})}),e.jsx(A,{children:Object.entries(x).map(([a,r])=>e.jsxs(y,{className:"border-b border-gray-200",children:[e.jsx(v,{className:"px-4 py-2 font-medium",children:a}),e.jsx(v,{className:"px-4 py-2",children:typeof r=="boolean"?r?"Success ✅":"Failed ❌":String(r)})]},a))})]})})]})]})]})})})};export{Y as default};
