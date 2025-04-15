import{r as i,m as j,j as e}from"./app-DMvSxdSr.js";import{C as d}from"./circle-alert-Drcw10cE.js";import{E as w,a as y}from"./eye-BWIEhbTq.js";import{L as x}from"./loader-circle-CX_lKKhC.js";import"./createLucideIcon-DU2LoeeI.js";function S(){const[n,u]=i.useState(!1),[g,o]=i.useState("idle"),{data:l,setData:r,reset:h,errors:t,post:p,processing:m}=j({email:"",password:"",remember:!1,gps_location:null,device_id:null});i.useEffect(()=>{r("device_id",(()=>{const a=window.navigator,c=window.screen,f=[a.userAgent,c.height,c.width,c.colorDepth,new Date().getTimezoneOffset()];return btoa(f.join("|")).substring(0,32)})())},[r]),i.useEffect(()=>{navigator.geolocation?(o("loading"),navigator.geolocation.getCurrentPosition(s=>{const a=`${s.coords.latitude},${s.coords.longitude}`;r("gps_location",a),o("success")},s=>{console.error("Error getting location:",s.message),o("error")},{enableHighAccuracy:!0,timeout:1e4,maximumAge:0})):(console.log("Geolocation is not supported by this browser."),o("error"))},[r]);const b=s=>{s.preventDefault(),p("/login",{onError:a=>{console.error("Error during login:",a)},onSuccess:()=>{h("password")}})};return e.jsx("div",{className:"min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4",children:e.jsxs("div",{className:"max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md",children:[e.jsxs("div",{children:[e.jsx("h2",{className:"mt-2 text-center text-3xl font-extrabold text-gray-900",children:"Welcome to User Panel"}),e.jsx("p",{className:"mt-2 text-center text-sm text-gray-600",children:"Please sign in to your account"})]}),t.message&&e.jsx("div",{className:"bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative",children:e.jsxs("div",{className:"flex items-center",children:[e.jsx(d,{className:"h-5 w-5 mr-2"}),e.jsx("span",{className:"block sm:inline",children:t.message})]})}),t.email&&e.jsx("div",{className:"bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative",children:e.jsxs("div",{className:"flex items-center",children:[e.jsx(d,{className:"h-5 w-5 mr-2"}),e.jsx("span",{className:"block sm:inline",children:t.email})]})}),t.password&&e.jsx("div",{className:"bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative",children:e.jsxs("div",{className:"flex items-center",children:[e.jsx(d,{className:"h-5 w-5 mr-2"}),e.jsx("span",{className:"block sm:inline",children:t.password})]})}),e.jsxs("form",{className:"mt-8 space-y-6",onSubmit:b,children:[e.jsxs("div",{className:"space-y-4",children:[e.jsxs("div",{children:[e.jsx("label",{htmlFor:"email",className:"block text-sm font-medium text-gray-700",children:"Email address"}),e.jsx("input",{id:"email",type:"email",required:!0,className:"mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm",value:l.email,onChange:s=>r("email",s.target.value)})]}),e.jsxs("div",{children:[e.jsx("label",{htmlFor:"password",className:"block text-sm font-medium text-gray-700",children:"Password"}),e.jsxs("div",{className:"relative",children:[e.jsx("input",{id:"password",type:n?"text":"password",required:!0,className:"mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm",value:l.password,onChange:s=>r("password",s.target.value)}),e.jsx("button",{type:"button",className:"absolute inset-y-0 right-0 pr-3 flex items-center",onClick:()=>u(!n),children:n?e.jsx(w,{className:"h-5 w-5 text-gray-400"}):e.jsx(y,{className:"h-5 w-5 text-gray-400"})})]})]})]}),e.jsx("div",{className:"flex items-center justify-between",children:e.jsxs("div",{className:"flex items-center",children:[e.jsx("input",{id:"remember",type:"checkbox",className:"h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded",checked:l.remember,onChange:s=>r("remember",s.target.checked)}),e.jsx("label",{htmlFor:"remember",className:"ml-2 block text-sm text-gray-900",children:"Remember me"})]})}),g==="loading"&&e.jsxs("div",{className:"flex items-center justify-center text-sm text-gray-500",children:[e.jsx(x,{className:"h-4 w-4 mr-2 animate-spin"}),e.jsx("span",{children:"Getting location..."})]}),e.jsx("div",{children:e.jsx("button",{type:"submit",disabled:m,className:"w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50",children:m?e.jsx(x,{className:"h-5 w-5 animate-spin"}):"Sign in"})})]})]})})}export{S as default};
