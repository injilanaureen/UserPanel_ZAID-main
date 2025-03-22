import React, { useState } from "react";
import axios from "axios";
import AdminLayout from "@/Layouts/AdminLayout";
import { Search, AlertCircle, CheckCircle, Code, MapPin, Calendar, Bus, User, Tag, Clock } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const CheckBookedTicket = () => {
  const [ticketData, setTicketData] = useState(null);
  const [errorMessage, setErrorMessage] = useState(""); 
  const [refid, setRefid] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

  const fetchData = async (event) => {
    event.preventDefault();
    setLoading(true);
    setErrorMessage("");
    setSuccess("");
    setTicketData(null);

    try {
      const response = await axios.post("/admin/busTicket/fetchBookedTickets", {
        refid: parseInt(refid, 10),
      });
      
      if (response.data.success) {
        setTicketData(response.data.data);
        setSuccess("Ticket details fetched successfully!");
      } else {
        setErrorMessage(response.data.message || "Failed to fetch ticket data");
      }
    } catch (error) {
      console.error("Error fetching ticket data:", error);
      
      if (error.response && error.response.data) {
        setErrorMessage(error.response.data.message || "Error fetching ticket data");
      } else {
        setErrorMessage("Failed to connect to the server");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-full">
        <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
          <div className="bg-gradient-to-tr from-gray-400 to-black py-4 px-6">
            <h2 className="text-3xl font-semibold text-white">Check Booked Ticket</h2>
          </div>

          <form onSubmit={fetchData} className="p-6">
            <div className="mb-6">
              <label htmlFor="refid" className="flex items-center text-sm font-medium text-gray-600 mb-1">
                <Search size={20} className="mr-2 text-blue-500" />
                Reference ID
              </label>
              <input
                id="refid"
                type="text"
                value={refid}
                onChange={(e) => setRefid(e.target.value)}
                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all"
                required
                placeholder="Enter Reference ID"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gray-800 text-white py-3 px-4 rounded-lg hover:bg-black focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Searching...
                </span>
              ) : "Search Ticket"}
            </button>
          </form>

          <div className="px-6 pb-6">
            {errorMessage && (
              <div className="mt-4 p-4 bg-red-50 border border-red-100 rounded-lg">
                <p className="text-red-600 text-sm flex items-center">
                  <AlertCircle size={16} className="mr-2" />
                  {errorMessage}
                </p>
              </div>
            )}

            {success && (
              <div className="mt-4 p-4 bg-green-50 border border-green-100 rounded-lg">
                <p className="text-green-600 text-sm flex items-center">
                  <CheckCircle size={16} className="mr-2" />
                  {success}
                </p>
              </div>
            )}

            {ticketData && (
              <div className="mt-6">
                <h3 className="font-medium text-sm text-gray-700 mb-4 flex items-center">
                  <Code size={16} className="mr-2" />
                  Ticket Details:
                </h3>
                <div className="border border-gray-200 rounded-lg shadow-md overflow-hidden">
                  <Table className="w-full border-collapse">
                    <TableHeader className="bg-sky-500 text-white">
                      <TableRow>
                        <TableHead className="px-4 py-2 text-left">Detail</TableHead>
                        <TableHead className="px-4 py-2 text-left">Information</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow className="border-b border-gray-200">
                        <TableCell className="px-4 py-3 font-medium flex items-center">
                          <MapPin size={16} className="mr-2 text-red-500" />
                          Source - Destination
                        </TableCell>
                        <TableCell className="px-4 py-3">
                          {ticketData.sourceCity} - {ticketData.destinationCity}
                        </TableCell>
                      </TableRow>
                      <TableRow className="border-b border-gray-200">
                        <TableCell className="px-4 py-3 font-medium flex items-center">
                          <Bus size={16} className="mr-2 text-blue-500" />
                          Bus Type
                        </TableCell>
                        <TableCell className="px-4 py-3">{ticketData.busType}</TableCell>
                      </TableRow>
                      <TableRow className="border-b border-gray-200">
                        <TableCell className="px-4 py-3 font-medium flex items-center">
                          <Calendar size={16} className="mr-2 text-green-500" />
                          Travel Date
                        </TableCell>
                        <TableCell className="px-4 py-3">{ticketData.doj}</TableCell>
                      </TableRow>
                      <TableRow className="border-b border-gray-200">
                        <TableCell className="px-4 py-3 font-medium flex items-center">
                          <Clock size={16} className="mr-2 text-purple-500" />
                          Pickup Details
                        </TableCell>
                        <TableCell className="px-4 py-3">
                          {ticketData.pickupLocation} ({ticketData.pickupTime})
                        </TableCell>
                      </TableRow>
                      <TableRow className="border-b border-gray-200">
                        <TableCell className="px-4 py-3 font-medium flex items-center">
                          <Clock size={16} className="mr-2 text-orange-500" />
                          Drop Details
                        </TableCell>
                        <TableCell className="px-4 py-3">
                          {ticketData.dropLocation} ({ticketData.dropTime})
                        </TableCell>
                      </TableRow>
                      <TableRow className="border-b border-gray-200">
                        <TableCell className="px-4 py-3 font-medium flex items-center">
                          <User size={16} className="mr-2 text-indigo-500" />
                          Passenger Name
                        </TableCell>
                        <TableCell className="px-4 py-3">
                          {ticketData.inventoryItems.passenger.name}
                        </TableCell>
                      </TableRow>
                      <TableRow className="border-b border-gray-200">
                        <TableCell className="px-4 py-3 font-medium flex items-center">
                          <Tag size={16} className="mr-2 text-yellow-500" />
                          PNR
                        </TableCell>
                        <TableCell className="px-4 py-3">{ticketData.pnr}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="px-4 py-3 font-medium flex items-center">
                          <AlertCircle size={16} className="mr-2 text-gray-500" />
                          Status
                        </TableCell>
                        <TableCell className="px-4 py-3">
                          <span className={`px-3 py-1 rounded-full text-sm ${
                            ticketData.status.toLowerCase() === 'confirmed' 
                              ? 'bg-green-100 text-green-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {ticketData.status}
                          </span>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default CheckBookedTicket;