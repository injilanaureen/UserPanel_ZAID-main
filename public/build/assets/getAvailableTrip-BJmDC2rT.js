import{r as i,j as e}from"./app-scOM1Bov.js";import{A as se,C as ae}from"./AdminLayout-CpYTA3QK.js";import{R as re}from"./receipt-B9NjTYXB.js";import{S as z}from"./search-CsroJBn0.js";import{L as te,S as le}from"./ship-wheel-C-nZ5yuZ.js";import{L as O}from"./loader-circle-BUZhiRtK.js";import{C as ne}from"./chevron-up-BO8K-APT.js";import"./x-Dbx5JJsn.js";import"./createLucideIcon-B6EbXdE0.js";const je=()=>{const[v,g]=i.useState({source_id:"",destination_id:"",date_of_journey:""}),[u,j]=i.useState([]),[p,A]=i.useState(!1),[N,d]=i.useState(null),[t,H]=i.useState({busType:"",availability:"",fareRange:""}),[V,W]=i.useState([]),[X,$]=i.useState([]),[S,T]=i.useState(""),[C,w]=i.useState(""),[J,y]=i.useState(!1),[U,b]=i.useState(!1),[m,G]=i.useState(null);i.useEffect(()=>{(async()=>{try{const r=await fetch("/admin/busTicket/fetchSourceCities",{method:"POST",headers:{"Content-Type":"application/json","X-CSRF-TOKEN":document.querySelector('meta[name="csrf-token"]').getAttribute("content")}});if(!r.ok)throw new Error("Network response was not ok");const a=await r.json();if(a.status&&a.data.cities)W(a.data.cities),$(a.data.cities);else throw new Error("Failed to fetch cities data")}catch(r){d(r.message)}})()},[]);const D=V.filter(s=>s.name.toLowerCase().includes(S.toLowerCase())).slice(0,10),F=X.filter(s=>s.name.toLowerCase().includes(C.toLowerCase())).slice(0,10),K=s=>{const{name:r,value:a}=s.target;g(l=>({...l,[r]:a})),d(null)},f=s=>{const{name:r,value:a}=s.target;H(l=>({...l,[r]:a}))},k=(s,r)=>{s==="source"?(g(a=>({...a,source_id:r.id})),T(r.name),y(!1)):(g(a=>({...a,destination_id:r.id})),w(r.name),b(!1))},Z=async s=>{var r;s.preventDefault(),A(!0),d(null),j([]);try{const a=await fetch("/admin/busTicket/fetchAvailableTrips",{method:"POST",headers:{"Content-Type":"application/json",Accept:"application/json","X-CSRF-TOKEN":document.querySelector('meta[name="csrf-token"]').getAttribute("content"),"X-Requested-With":"XMLHttpRequest"},body:JSON.stringify(v)}),l=await a.json();if(!a.ok)throw new Error(l.message||`HTTP error! status: ${a.status}`);const c=Array.isArray((r=l.data)==null?void 0:r.availableTrips)?l.data.availableTrips:[];j(c),c.length===0&&d("No trips found for the selected criteria.")}catch(a){d(a.message||"Failed to fetch trips. Please try again."),j([])}finally{A(!1)}},R=()=>u.filter(s=>{const r=!t.busType||s.busType===t.busType,a=parseInt(s.availableSeats)||0,l=!t.availability||t.availability==="1-5"&&a<=5||t.availability==="6-10"&&a>5&&a<=10||t.availability==="11-20"&&a>10&&a<=20||t.availability==="21+"&&a>20,c=parseFloat(Array.isArray(s.fares)?s.fares[0]:s.fares)||0,h=!t.fareRange||t.fareRange==="low"&&c<=2e3||t.fareRange==="medium"&&c>2e3&&c<=4e3||t.fareRange==="high"&&c>4e3;return r&&l&&h}),Q=()=>[...new Set(u.map(s=>s.busType).filter(Boolean))],o=s=>{if(!s)return"N/A";const r=Math.floor(s/60),a=s%60,l=r>=12?"PM":"AM";return`${r%12||12}:${a<10?"0"+a:a} ${l}`},ee=s=>{G(m===s?null:s)};return e.jsx(se,{children:e.jsxs("div",{className:"max-w-full mx-auto p-6",children:[e.jsx("div",{className:"bg-gradient-to-r from-gray-700 to-black py-4 px-6 rounded-lg mb-6",children:e.jsx("h2",{className:"text-2xl font-bold text-white",children:"Search Bus Trips"})}),e.jsxs("form",{onSubmit:Z,className:"space-y-6",children:[e.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-3 gap-4",children:[e.jsxs("div",{className:"relative",children:[e.jsxs("label",{className:"flex items-center gap-2 text-gray-700 font-medium mb-2",children:[e.jsx(re,{size:18,className:"text-green-500"})," Source City"]}),e.jsxs("div",{className:"relative",children:[e.jsx(z,{className:"absolute left-3 top-3 h-4 w-4 text-gray-400"}),e.jsx("input",{type:"text",value:S,onChange:s=>{T(s.target.value),y(!0)},onFocus:()=>y(!0),className:"w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500",placeholder:"Search source city...",required:!0}),J&&D.length>0&&e.jsx("ul",{className:"absolute z-10 w-full bg-white border rounded-lg mt-1 max-h-60 overflow-y-auto shadow-lg",children:D.map(s=>e.jsxs("li",{onClick:()=>k("source",s),className:"px-4 py-2 hover:bg-gray-100 cursor-pointer",children:[s.name,", ",s.state," (ID: ",s.id,")"]},s.id))})]})]}),e.jsxs("div",{className:"relative",children:[e.jsxs("label",{className:"flex items-center gap-2 text-gray-700 font-medium mb-2",children:[e.jsx(te,{size:18,className:"text-yellow-500"})," Destination City"]}),e.jsxs("div",{className:"relative",children:[e.jsx(z,{className:"absolute left-3 top-3 h-4 w-4 text-gray-400"}),e.jsx("input",{type:"text",value:C,onChange:s=>{w(s.target.value),b(!0)},onFocus:()=>b(!0),className:"w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-yellow-500",placeholder:"Search destination city...",required:!0}),U&&F.length>0&&e.jsx("ul",{className:"absolute z-10 w-full bg-white border rounded-lg mt-1 max-h-60 overflow-y-auto shadow-lg",children:F.map(s=>e.jsxs("li",{onClick:()=>k("destination",s),className:"px-4 py-2 hover:bg-gray-100 cursor-pointer",children:[s.name,", ",s.state," (ID: ",s.id,")"]},s.id))})]})]}),e.jsxs("div",{children:[e.jsxs("label",{className:"flex items-center gap-2 text-gray-700 font-medium mb-2",children:[e.jsx(le,{size:18,className:"text-red-500"})," Date of Journey"]}),e.jsx("input",{type:"date",name:"date_of_journey",value:v.date_of_journey,onChange:K,className:"w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500",required:!0,min:new Date().toISOString().split("T")[0]})]})]}),e.jsx("button",{type:"submit",disabled:p,className:"w-full bg-gray-600 text-white py-2 rounded-lg hover:bg-gray-700 disabled:opacity-50 flex items-center justify-center",children:p?e.jsxs(e.Fragment,{children:[e.jsx(O,{className:"h-5 w-5 animate-spin mr-2"})," Searching..."]}):"Search Trips"})]}),N&&e.jsx("div",{className:"bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mt-6 rounded",children:e.jsx("p",{children:N})}),p?e.jsx("div",{className:"flex items-center justify-center h-64",children:e.jsx(O,{className:"h-8 w-8 animate-spin text-gray-600"})}):u.length>0?e.jsxs("div",{className:"mt-6",children:[e.jsxs("h3",{className:"text-xl font-semibold text-gray-800 mb-4",children:["Available Trips (",R().length,")"]}),e.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-3 gap-4 mb-6",children:[e.jsxs("select",{name:"busType",value:t.busType,onChange:f,className:"px-4 py-2 border rounded-lg focus:ring-2 focus:ring-gray-500",children:[e.jsx("option",{value:"",children:"All Bus Types"}),Q().map(s=>e.jsx("option",{value:s,children:s},s))]}),e.jsxs("select",{name:"availability",value:t.availability,onChange:f,className:"px-4 py-2 border rounded-lg focus:ring-2 focus:ring-gray-500",children:[e.jsx("option",{value:"",children:"All Availabilities"}),e.jsx("option",{value:"1-5",children:"1-5 Seats"}),e.jsx("option",{value:"6-10",children:"6-10 Seats"}),e.jsx("option",{value:"11-20",children:"11-20 Seats"}),e.jsx("option",{value:"21+",children:"21+ Seats"})]}),e.jsxs("select",{name:"fareRange",value:t.fareRange,onChange:f,className:"px-4 py-2 border rounded-lg focus:ring-2 focus:ring-gray-500",children:[e.jsx("option",{value:"",children:"All Fare Ranges"}),e.jsx("option",{value:"low",children:"Low (≤₹2000)"}),e.jsx("option",{value:"medium",children:"Medium (₹2001-₹4000)"}),e.jsx("option",{value:"high",children:"High (≥₹4000)"})]})]}),e.jsx("div",{className:"space-y-6",children:R().map(s=>{var r,a,l,c,h,B,P,I,L,Y,E,M,_,q;return e.jsxs("div",{className:"border rounded-lg shadow-md bg-white p-4 hover:shadow-lg transition",children:[e.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-5 gap-4",children:[e.jsxs("div",{children:[e.jsx("p",{className:"text-sm text-gray-500",children:"Travels"}),e.jsx("p",{className:"font-semibold text-gray-800",children:s.travels||"N/A"}),e.jsx("p",{className:"text-sm text-gray-600",children:s.busType||"N/A"})]}),e.jsxs("div",{children:[e.jsx("p",{className:"text-sm text-gray-500",children:"Departure"}),e.jsx("p",{className:"font-semibold text-gray-800",children:o(s.departureTime)}),e.jsx("p",{className:"text-sm text-gray-600",children:((a=(r=s.boardingTimes)==null?void 0:r[0])==null?void 0:a.location)||"N/A"})]}),e.jsxs("div",{children:[e.jsx("p",{className:"text-sm text-gray-500",children:"Arrival"}),e.jsx("p",{className:"font-semibold text-gray-800",children:o(s.arrivalTime)}),e.jsx("p",{className:"text-sm text-gray-600",children:((c=(l=s.droppingTimes)==null?void 0:l[0])==null?void 0:c.location)||((h=s.droppingTimes)==null?void 0:h.location)||"N/A"})]}),e.jsxs("div",{children:[e.jsx("p",{className:"text-sm text-gray-500",children:"Duration"}),e.jsx("p",{className:"font-semibold text-gray-800",children:s.duration||"N/A"}),e.jsxs("p",{className:"text-sm text-gray-600",children:["Seats: ",s.availableSeats||"N/A"]})]}),e.jsxs("div",{children:[e.jsx("p",{className:"text-sm text-gray-500",children:"Fare"}),e.jsxs("p",{className:"font-semibold text-green-600",children:["₹",Array.isArray(s.fares)?s.fares[0]:s.fares||"N/A"]}),e.jsxs("button",{onClick:()=>ee(s.id),className:"text-blue-600 text-sm flex items-center gap-1 mt-1",children:[m===s.id?"Hide Details":"Show Details",m===s.id?e.jsx(ne,{size:16}):e.jsx(ae,{size:16})]})]})]}),m===s.id&&e.jsxs("div",{className:"mt-4 border-t pt-4 grid grid-cols-1 md:grid-cols-2 gap-6",children:[e.jsxs("div",{children:[e.jsx("h4",{className:"font-semibold text-gray-700 mb-2",children:"Trip Information"}),e.jsxs("p",{children:[e.jsx("span",{className:"text-gray-500",children:"ID:"})," ",s.id||"N/A"]}),e.jsxs("p",{children:[e.jsx("span",{className:"text-gray-500",children:"Service ID:"})," ",s.busServiceId||"N/A"]}),e.jsxs("p",{children:[e.jsx("span",{className:"text-gray-500",children:"Route ID:"})," ",s.routeId||"N/A"]}),e.jsxs("p",{children:[e.jsx("span",{className:"text-gray-500",children:"Date of Journey:"})," ",s.doj?new Date(s.doj).toLocaleDateString():"N/A"]}),e.jsxs("p",{children:[e.jsx("span",{className:"text-gray-500",children:"Bus Routes:"})," ",s.busRoutes||"N/A"]}),e.jsxs("p",{children:[e.jsx("span",{className:"text-gray-500",children:"Vehicle Type:"})," ",s.vehicleType||"N/A"]}),e.jsxs("p",{children:[e.jsx("span",{className:"text-gray-500",children:"Sub Bus Type:"})," ",s.subBusType||"N/A"]}),e.jsxs("p",{children:[e.jsx("span",{className:"text-gray-500",children:"Bus Type ID:"})," ",s.busTypeId||"N/A"]}),e.jsxs("p",{children:[e.jsx("span",{className:"text-gray-500",children:"Operator:"})," ",s.operator||"N/A"]}),e.jsxs("p",{children:[e.jsx("span",{className:"text-gray-500",children:"AC:"})," ",s.AC==="true"?"Yes":"No"]}),e.jsxs("p",{children:[e.jsx("span",{className:"text-gray-500",children:"Non-AC:"})," ",s.nonAC==="true"?"Yes":"No"]}),e.jsxs("p",{children:[e.jsx("span",{className:"text-gray-500",children:"Seater:"})," ",s.seater==="true"?"Yes":"No"]}),e.jsxs("p",{children:[e.jsx("span",{className:"text-gray-500",children:"Sleeper:"})," ",s.sleeper==="true"?"Yes":"No"]}),e.jsxs("p",{children:[e.jsx("span",{className:"text-gray-500",children:"Available Single Seats:"})," ",s.availableSingleSeat||"N/A"]}),e.jsxs("p",{children:[e.jsx("span",{className:"text-gray-500",children:"Window Seats:"})," ",s.avlWindowSeats||"N/A"]})]}),e.jsxs("div",{children:[e.jsx("h4",{className:"font-semibold text-gray-700 mb-2",children:"Boarding & Dropping Points"}),e.jsx("p",{className:"text-gray-500",children:"Boarding Points:"}),Array.isArray(s.boardingTimes)?s.boardingTimes.map((n,x)=>e.jsxs("p",{className:"text-sm",children:[n.bpName," - ",n.address," (",o(n.time),")"]},x)):e.jsxs("p",{children:[((B=s.boardingTimes)==null?void 0:B.bpName)||"N/A"," - ",((P=s.boardingTimes)==null?void 0:P.address)||"N/A"," (",o((I=s.boardingTimes)==null?void 0:I.time),")"]}),e.jsx("p",{className:"text-gray-500 mt-2",children:"Dropping Points:"}),Array.isArray(s.droppingTimes)?s.droppingTimes.map((n,x)=>e.jsxs("p",{className:"text-sm",children:[n.bpName," - ",n.address," (",o(n.time),")"]},x)):e.jsxs("p",{children:[((L=s.droppingTimes)==null?void 0:L.bpName)||"N/A"," - ",((Y=s.droppingTimes)==null?void 0:Y.address)||"N/A"," (",o((E=s.droppingTimes)==null?void 0:E.time),")"]})]}),e.jsxs("div",{children:[e.jsx("h4",{className:"font-semibold text-gray-700 mb-2",children:"Fare Details"}),Array.isArray(s.fareDetails)&&s.fareDetails.length>0?s.fareDetails.map((n,x)=>e.jsxs("div",{className:"mb-2",children:[e.jsxs("p",{children:[e.jsx("span",{className:"text-gray-500",children:"Base Fare:"})," ₹",n.baseFare||"N/A"]}),e.jsxs("p",{children:[e.jsx("span",{className:"text-gray-500",children:"GST:"})," ₹",n.gst||"N/A"]}),e.jsxs("p",{children:[e.jsx("span",{className:"text-gray-500",children:"Total Fare:"})," ₹",n.totalFare||"N/A"]}),e.jsxs("p",{children:[e.jsx("span",{className:"text-gray-500",children:"Service Charge:"})," ₹",n.serviceCharge||"N/A"]}),e.jsxs("p",{children:[e.jsx("span",{className:"text-gray-500",children:"Booking Fee:"})," ₹",n.bookingFee||"N/A"]}),e.jsxs("p",{children:[e.jsx("span",{className:"text-gray-500",children:"Child Fare:"})," ₹",n.childFare||"N/A"]})]},x)):e.jsx("p",{children:"No fare details available"}),e.jsxs("p",{children:[e.jsx("span",{className:"text-gray-500",children:"Fares List:"})," ",Array.isArray(s.fares)?s.fares.join(", "):s.fares?s.fares.toString():"N/A"]})]}),e.jsxs("div",{children:[e.jsx("h4",{className:"font-semibold text-gray-700 mb-2",children:"Policies & Features"}),e.jsxs("p",{children:[e.jsx("span",{className:"text-gray-500",children:"Cancellation Policy:"})," ",s.cancellationPolicy||"N/A"]}),e.jsxs("p",{children:[e.jsx("span",{className:"text-gray-500",children:"Partial Cancellation:"})," ",s.partialCancellationAllowed==="true"?"Yes":"No"]}),e.jsxs("p",{children:[e.jsx("span",{className:"text-gray-500",children:"Primary Pax Cancellable:"})," ",s.primaryPaxCancellable==="true"?"Yes":"No"]}),e.jsxs("p",{children:[e.jsx("span",{className:"text-gray-500",children:"Zero Cancellation Time:"})," ",s.zeroCancellationTime||"N/A"]}),e.jsxs("p",{children:[e.jsx("span",{className:"text-gray-500",children:"Tatkal Time:"})," ",s.tatkalTime||"N/A"]}),e.jsxs("p",{children:[e.jsx("span",{className:"text-gray-500",children:"mTicket Enabled:"})," ",s.mTicketEnabled==="true"?"Yes":"No"]}),e.jsxs("p",{children:[e.jsx("span",{className:"text-gray-500",children:"Live Tracking:"})," ",s.liveTrackingAvailable==="true"?"Yes":"No"]}),e.jsxs("p",{children:[e.jsx("span",{className:"text-gray-500",children:"Vaccinated Bus:"})," ",s.vaccinatedBus==="true"?"Yes":"No"]}),e.jsxs("p",{children:[e.jsx("span",{className:"text-gray-500",children:"Vaccinated Staff:"})," ",s.vaccinatedStaff==="true"?"Yes":"No"]}),e.jsxs("p",{children:[e.jsx("span",{className:"text-gray-500",children:"Social Distancing:"})," ",s.socialDistancing==="true"?"Yes":"No"]}),e.jsxs("p",{children:[e.jsx("span",{className:"text-gray-500",children:"ID Proof Required:"})," ",s.idProofRequired==="true"?"Yes":"No"]}),e.jsxs("p",{children:[e.jsx("span",{className:"text-gray-500",children:"Max Seats/Ticket:"})," ",s.maxSeatsPerTicket||"N/A"]})]}),e.jsxs("div",{children:[e.jsx("h4",{className:"font-semibold text-gray-700 mb-2",children:"Additional Information"}),e.jsxs("p",{children:[e.jsx("span",{className:"text-gray-500",children:"Agent Service Charge:"})," ₹",s.agentServiceCharge||"N/A"]}),e.jsxs("p",{children:[e.jsx("span",{className:"text-gray-500",children:"Agent Service Charge Allowed:"})," ",s.agentServiceChargeAllowed==="true"?"Yes":"No"]}),e.jsxs("p",{children:[e.jsx("span",{className:"text-gray-500",children:"Additional Commission:"})," ₹",s.additionalCommission||"N/A"]}),e.jsxs("p",{children:[e.jsx("span",{className:"text-gray-500",children:"BO Commission:"})," ₹",s.boCommission||"N/A"]}),e.jsxs("p",{children:[e.jsx("span",{className:"text-gray-500",children:"Partner Base Commission:"})," ₹",s.partnerBaseCommission||"N/A"]}),e.jsxs("p",{children:[e.jsx("span",{className:"text-gray-500",children:"GDS Commission:"})," ₹",s.gdsCommission||"N/A"]}),e.jsxs("p",{children:[e.jsx("span",{className:"text-gray-500",children:"Bus Cancelled:"})," ",s.busCancelled==="true"?"Yes":"No"]}),e.jsxs("p",{children:[e.jsx("span",{className:"text-gray-500",children:"Bookable:"})," ",s.bookable==="true"?"Yes":"No"]}),e.jsxs("p",{children:[e.jsx("span",{className:"text-gray-500",children:"Images Count:"})," ",s.busImageCount||"N/A"]}),e.jsxs("p",{children:[e.jsx("span",{className:"text-gray-500",children:"Images Metadata URL:"})," ",s.imagesMetadataUrl||"N/A"]}),e.jsxs("p",{children:[e.jsx("span",{className:"text-gray-500",children:"Via Route:"})," ",s.viaRt||"N/A"]}),e.jsxs("p",{children:[e.jsx("span",{className:"text-gray-500",children:"Next Day:"})," ",s.nextDay==="true"?"Yes":"No"]})]}),e.jsxs("div",{children:[e.jsx("h4",{className:"font-semibold text-gray-700 mb-2",children:"Bus Information"}),e.jsxs("p",{children:[e.jsx("span",{className:"text-gray-500",children:"Bus Number:"})," ",((M=s.businfo)==null?void 0:M.busNumber)||"N/A"]}),e.jsxs("p",{children:[e.jsx("span",{className:"text-gray-500",children:"Driver Name:"})," ",((_=s.businfo)==null?void 0:_.driverName)||"N/A"]}),e.jsxs("p",{children:[e.jsx("span",{className:"text-gray-500",children:"Driver Mobile:"})," ",((q=s.businfo)==null?void 0:q.driverMobile)||"N/A"]})]})]})]},s.id)})})]}):!N&&e.jsx("div",{className:"text-gray-600 p-4 text-center",children:"No trips available. Please search with different criteria."})]})})};export{je as default};
