import React, { useState } from "react";
import axios from "axios";
import AdminLayout from "@/Layouts/AdminLayout";

const CheckBookedTicket = () => {
  const [ticketData, setTicketData] = useState(null);
  const [refid, setRefid] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchData = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post("/admin/busTicket/fetchBookedTickets", {
        refid: refid,
      });
      setTicketData(response.data.data);
      console.log(response)
    } catch (error) {
      console.error("Error fetching ticket data:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="p-6 max-w-4xl mx-auto bg-white rounded-xl shadow-md space-y-4">
        <h1 className="text-2xl font-bold text-center">Booked Ticket Details</h1>
        <form onSubmit={fetchData} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Reference ID</label>
            <input
              type="text"
              value={refid}
              onChange={(e) => setRefid(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 disabled:opacity-50"
          >
            {loading ? "Searching..." : "Search Ticket"}
          </button>
        </form>

        {ticketData && (
          <div className="overflow-x-auto mt-6">
            <table className="min-w-full bg-white border border-gray-300">
              <thead>
                <tr className="bg-gray-200">
                  <th className="py-2 px-4 border">Source</th>
                  <th className="py-2 px-4 border">Destination</th>
                  <th className="py-2 px-4 border">Bus Type</th>
                  <th className="py-2 px-4 border">Travel Date</th>
                  <th className="py-2 px-4 border">Pickup</th>
                  <th className="py-2 px-4 border">Drop</th>
                  <th className="py-2 px-4 border">Passenger Name</th>
                  <th className="py-2 px-4 border">PNR</th>
                  <th className="py-2 px-4 border">Status</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="py-2 px-4 border">{ticketData.sourceCity}</td>
                  <td className="py-2 px-4 border">{ticketData.destinationCity}</td>
                  <td className="py-2 px-4 border">{ticketData.busType}</td>
                  <td className="py-2 px-4 border">{ticketData.doj}</td>
                  <td className="py-2 px-4 border">{ticketData.pickupLocation} ({ticketData.pickupTime})</td>
                  <td className="py-2 px-4 border">{ticketData.dropLocation} ({ticketData.dropTime})</td>
                  <td className="py-2 px-4 border">{ticketData.inventoryItems.passenger.name}</td>
                  <td className="py-2 px-4 border">{ticketData.pnr}</td>
                  <td className="py-2 px-4 border">{ticketData.status}</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default CheckBookedTicket;
