import{r,j as e,S as N}from"./app-DFNezYz6.js";import{A as w}from"./AdminLayout-KexeQ_xO.js";import{C as d}from"./circle-alert-C3LxxvWo.js";import{C as v}from"./code-5Ij8VCPR.js";import"./x-BepMNS_z.js";import"./createLucideIcon-9k6RJPFL.js";import"./log-out-DEnWwGUE.js";function k({apiResponse:s,refid:h,error:l}){const[a,m]=r.useState({refid:h||"",latitude:"",longitude:""}),[x,u]=r.useState(!1),[o,b]=r.useState(""),[g,i]=r.useState(!1),[f,n]=r.useState(null);r.useEffect(()=>{p()},[]),r.useEffect(()=>{s&&s.redirectionUrl&&b(s.redirectionUrl)},[s]),r.useEffect(()=>{o&&window.open(o,"_blank")},[o]);const p=()=>{navigator.geolocation?(i(!0),n(null),navigator.geolocation.getCurrentPosition(t=>{m(c=>({...c,latitude:t.coords.latitude.toString(),longitude:t.coords.longitude.toString()})),i(!1)},t=>{n("Unable to fetch location: "+t.message),i(!1)},{enableHighAccuracy:!0,timeout:1e4,maximumAge:0})):n("Geolocation is not supported by your browser")},j=t=>{m({...a,[t.target.name]:t.target.value})},y=t=>{t.preventDefault(),u(!0),N.post(route("generate.airtel.url"),a,{onFinish:()=>u(!1),onError:c=>{console.log("Submission errors:",c)}})};return e.jsx(w,{children:e.jsx("div",{className:"max-w-full mx-auto",children:e.jsxs("div",{className:"bg-white rounded-xl shadow-md overflow-hidden border border-gray-100",children:[e.jsx("div",{className:"bg-gradient-to-tr from-gray-400 to-black py-4 px-6",children:e.jsx("h2",{className:"text-3xl font-semibold text-white",children:"Generate Airtel URL"})}),e.jsxs("form",{onSubmit:y,className:"p-6",children:[e.jsx("div",{className:"grid grid-cols-1 gap-6 mb-6",children:e.jsxs("div",{children:[e.jsx("label",{htmlFor:"refid",className:"flex items-center text-sm font-medium text-gray-600 mb-1",children:"Reference ID"}),e.jsx("input",{id:"refid",type:"text",name:"refid",value:a.refid,onChange:j,className:"w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all",maxLength:50,placeholder:"Enter Reference ID"}),(l==null?void 0:l.refid)&&e.jsxs("p",{className:"text-red-600 text-sm mt-1 flex items-center",children:[e.jsx(d,{size:16,className:"mr-2"}),l.refid]})]})}),g&&e.jsx("div",{className:"mb-6 p-3 bg-blue-50 border border-blue-100 rounded-lg",children:e.jsxs("p",{className:"text-blue-700 text-sm flex items-center",children:[e.jsxs("svg",{className:"animate-spin h-4 w-4 mr-2",xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24",children:[e.jsx("circle",{className:"opacity-25",cx:"12",cy:"12",r:"10",stroke:"currentColor",strokeWidth:"4"}),e.jsx("path",{className:"opacity-75",fill:"currentColor",d:"M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"})]}),"Fetching your location..."]})}),f&&e.jsx("div",{className:"mb-6 p-3 bg-yellow-50 border border-yellow-100 rounded-lg",children:e.jsxs("p",{className:"text-yellow-700 text-sm flex items-center",children:[e.jsx(d,{size:16,className:"mr-2"}),f]})}),e.jsx("button",{type:"submit",disabled:x||g,className:"w-full bg-gray-800 text-white py-3 px-4 rounded-lg hover:bg-black focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium",children:x?e.jsxs("span",{className:"flex items-center justify-center",children:[e.jsxs("svg",{className:"animate-spin -ml-1 mr-2 h-4 w-4 text-white",xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24",children:[e.jsx("circle",{className:"opacity-25",cx:"12",cy:"12",r:"10",stroke:"currentColor",strokeWidth:"4"}),e.jsx("path",{className:"opacity-75",fill:"currentColor",d:"M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"})]}),"Generating..."]}):"Generate URL"})]}),e.jsxs("div",{className:"px-6 pb-6",children:[l&&typeof l=="string"&&e.jsx("div",{className:"mt-4 p-4 bg-red-50 border border-red-100 rounded-lg",children:e.jsxs("p",{className:"text-red-600 text-sm flex items-center",children:[e.jsx(d,{size:16,className:"mr-2"}),l]})}),s&&e.jsxs("div",{className:"mt-4",children:[e.jsxs("h3",{className:"font-medium text-sm text-gray-700 mb-2 flex items-center",children:[e.jsx(v,{size:16,className:"mr-2"}),"API Response"]}),e.jsx("div",{className:"border border-gray-200 rounded-lg p-4 bg-gray-50",children:e.jsx("pre",{className:`text-sm whitespace-pre-wrap ${s.status==="success"?"text-green-600":s.status==="error"?"text-red-600":"text-gray-600"}`,children:JSON.stringify(s,null,2)})})]})]})]})})})}export{k as default};
