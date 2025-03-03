import React, { useState, useEffect } from "react";
import AdminLayout from '@/Layouts/AdminLayout';
import axios from "axios";


const BookTicket = () => {
  const [formData, setFormData] = useState({
    refid: 3,
    amount: 6,
    base_fare: "5.50",
    blockKey: "150",
    passenger_phone: "9876543210",
    passenger_email: "example@email.com"
  });

  const [response, setResponse] = useState(null);
  const [bookedTickets, setBookedTickets] = useState([]);

  // useEffect(() => {
  //   fetchBookedTickets();
  // }, []);

  // const fetchBookedTickets = async () => {
  //   try {
  //     const res = await fetch("/fetch-bookticket");
  //     const data = await res.json();
  //     setBookedTickets(data);
  //   } catch (error) {
  //     console.error("Error fetching booked tickets:", error);
  //   }
  // };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("/admin/busTicket/bookticket", formData, {
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        }
      });
  
      console.log("Full Response:", res.data);
  
      // Ensure response is an array before setting state
      setResponse(Array.isArray(res.data) ? res.data : [res.data]);
    } catch (error) {
      console.error("Error booking ticket:", error.response ? error.response.data : error.message);
    }
  };
  

  return (
    <AdminLayout>
    <div className="p-4">
      <h1 className="text-2xl font-semibold text-gray-700">Book Ticket</h1>
      <form onSubmit={handleSubmit} className="mt-4 space-y-2">
        {Object.keys(formData).map((key) => (
          <div key={key}>
            <label className="block text-gray-600 capitalize">
              {key.replace("_", " ")}
            </label>
            <input
              type="text"
              name={key}
              value={formData[key]}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
            />
          </div>
        ))}
        <button
          type="submit"
          className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
        >
          Book Ticket
        </button>
      </form>

      {/* {response && (
        <div className="mt-4 p-2 bg-gray-100 rounded-md">
          <h2 className="text-lg font-semibold">API Response:</h2>
          <pre className="text-sm text-gray-800">
            {JSON.stringify(response, null, 2)}
          </pre>
        </div>
      )} */}

      <div className="mt-8">
        <h2 className="text-xl font-semibold text-gray-700">Booking History</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full bg-white border">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-2 border">Ref ID</th>
                <th className="px-4 py-2 border">Amount</th>
                <th className="px-4 py-2 border">Base Fare</th>
                <th className="px-4 py-2 border">Phone</th>
                <th className="px-4 py-2 border">Email</th>
                <th className="px-4 py-2 border">Status</th>
                <th className="px-4 py-2 border">Message</th>
                <th className="px-4 py-2 border">Date</th>
              </tr>
            </thead>
            <tbody>
              {response && response.map((ticket) => (
                <tr key={ticket.id}>
                  <td className="px-4 py-2 border">{formData.refid}</td>
                  <td className="px-4 py-2 border">{formData.amount}</td>
                  <td className="px-4 py-2 border">{formData.base_fare}</td>
                  <td className="px-4 py-2 border">{formData.passenger_phone}</td>
                  <td className="px-4 py-2 border">{formData.passenger_email}</td>
                  <td className="px-4 py-2 border">
                    <span className={`px-2 py-1 rounded ${ticket.status ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {ticket.status ? 'Success' : 'Failed'}
                    </span>
                  </td>
                  <td className="px-4 py-2 border">{ticket.message}</td>
                  <td className="px-4 py-2 border">
                    {new Date(ticket.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
    </AdminLayout>
  );
};

export default BookTicket;