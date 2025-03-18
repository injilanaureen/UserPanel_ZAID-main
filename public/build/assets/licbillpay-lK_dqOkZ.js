import{r as u,j as e,a as d}from"./app-C9Hasp1L.js";function m(){const[l,i]=u.useState({canumber:"",mode:"online",amount:"",ad1:"",ad2:"",ad3:"",referenceid:"",latitude:"27.2232",longitude:"78.26535",bill_fetch:{billNumber:"",billAmount:"",billnetamount:"",billdate:"",acceptPayment:!0,acceptPartPay:!1,cellNumber:"",dueFrom:"11/05/2021",dueTo:"11/05/2021",validationId:"",billId:""}}),t=o=>{const{name:a,value:r}=o.target;if(a.includes("bill_fetch.")){const n=a.split(".")[1];i(s=>({...s,bill_fetch:{...s.bill_fetch,[n]:r}}))}else i(n=>({...n,[a]:r}))},c=async o=>{o.preventDefault();try{const a=await d.post("https://sit.paysprint.in/service-api/api/v1/service/bill-payment/bill/paylicbill",l,{headers:{Authorisedkey:"Y2RkZTc2ZmNjODgxODljMjkyN2ViOTlhM2FiZmYyM2I=",Token:"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0aW1lc3RhbXAiOjE3Mzk5NTgwMjEsInBhcnRuZXJJZCI6IlBTMDAxNTY4IiwicmVxaWQiOiIxNzM5OTU4MDIxIn0.yAT45LjmoPr595zvgccFYVkfGD2GqDY_mEEDV6SvNtA",Accept:"text/plain","Content-Type":"application/json"}});if(console.log("API Response:",a.data),a.data.status===!0){const r={...l,response_code:a.data.response_code,operatorid:a.data.operatorid,ackno:a.data.ackno,refid:a.data.refid,message:a.data.message,bill_fetch:{...l.bill_fetch}};console.log("Data being sent to Laravel:",r);const n=await d.post("/save-bill-payment",r,{headers:{"Content-Type":"application/json",Accept:"application/json"}});n.data.status?alert("Bill Payment Successful and Data Saved!"):alert(n.data.message||"Failed to save data")}else alert("Bill Payment Failed: "+a.data.message)}catch(a){console.error("Error:",a),a.response?(console.error("Error Response:",a.response.data),alert(a.response.data.message||"An error occurred while processing payment.")):alert("An error occurred while processing payment.")}};return e.jsxs("div",{className:"p-4 max-w-lg mx-auto bg-white shadow-md rounded-lg",children:[e.jsx("h2",{className:"text-lg font-semibold mb-4",children:"LIC Bill Payment"}),e.jsxs("form",{onSubmit:c,className:"space-y-4",children:[e.jsx("input",{type:"number",name:"canumber",placeholder:"CA Number",value:l.canumber,onChange:t,className:"w-full p-2 border rounded",required:!0}),e.jsxs("select",{name:"mode",value:l.mode,onChange:t,className:"w-full p-2 border rounded",children:[e.jsx("option",{value:"online",children:"Online"}),e.jsx("option",{value:"offline",children:"Offline"})]}),e.jsx("input",{type:"number",name:"amount",placeholder:"Amount",value:l.amount,onChange:t,className:"w-full p-2 border rounded",required:!0}),e.jsx("input",{type:"text",name:"ad1",placeholder:"Email",value:l.ad1,onChange:t,className:"w-full p-2 border rounded",required:!0}),e.jsx("input",{type:"text",name:"ad2",placeholder:"Date",value:l.ad2,onChange:t,className:"w-full p-2 border rounded",required:!0}),e.jsx("input",{type:"text",name:"ad3",placeholder:"Transaction ID",value:l.ad3,onChange:t,className:"w-full p-2 border rounded",required:!0}),e.jsx("input",{type:"text",name:"referenceid",placeholder:"Reference ID",value:l.referenceid,onChange:t,className:"w-full p-2 border rounded",required:!0}),e.jsx("input",{type:"text",name:"bill_fetch.billNumber",placeholder:"Bill Number",value:l.bill_fetch.billNumber,onChange:t,className:"w-full p-2 border rounded",required:!0}),e.jsx("input",{type:"number",name:"bill_fetch.billAmount",placeholder:"Bill Amount",value:l.bill_fetch.billAmount,onChange:t,className:"w-full p-2 border rounded",required:!0}),e.jsx("input",{type:"number",name:"bill_fetch.billnetamount",placeholder:"Bill Net Amount",value:l.bill_fetch.billnetamount,onChange:t,className:"w-full p-2 border rounded",required:!0}),e.jsx("input",{type:"text",name:"bill_fetch.billdate",placeholder:"Bill Date",value:l.bill_fetch.billdate,onChange:t,className:"w-full p-2 border rounded",required:!0}),e.jsxs("select",{name:"bill_fetch.acceptPayment",value:l.bill_fetch.acceptPayment,onChange:t,className:"w-full p-2 border rounded",children:[e.jsx("option",{value:!0,children:"Accept Payment"}),e.jsx("option",{value:!1,children:"Don't Accept Payment"})]}),e.jsxs("select",{name:"bill_fetch.acceptPartPay",value:l.bill_fetch.acceptPartPay,onChange:t,className:"w-full p-2 border rounded",children:[e.jsx("option",{value:!0,children:"Accept Part Payment"}),e.jsx("option",{value:!1,children:"Don't Accept Part Payment"})]}),e.jsx("input",{type:"text",name:"bill_fetch.cellNumber",placeholder:"Cell Number",value:l.bill_fetch.cellNumber,onChange:t,className:"w-full p-2 border rounded",required:!0}),e.jsx("input",{type:"text",name:"bill_fetch.validationId",placeholder:"Validation ID",value:l.bill_fetch.validationId,onChange:t,className:"w-full p-2 border rounded",required:!0}),e.jsx("input",{type:"text",name:"bill_fetch.billId",placeholder:"Bill ID",value:l.bill_fetch.billId,onChange:t,className:"w-full p-2 border rounded",required:!0}),e.jsx("button",{type:"submit",className:"w-full bg-blue-500 text-white p-2 rounded",children:"Pay Bill"})]})]})}export{m as default};
