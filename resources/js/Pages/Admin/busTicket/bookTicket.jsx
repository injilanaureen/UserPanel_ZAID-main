import React, { useState, useEffect } from "react";
import AdminLayout from '@/Layouts/AdminLayout';
import axios from "axios";
import { Banknote, Phone, Mail, AlertCircle, CheckCircle, Code, Ticket } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const BookTicket = () => {
  // Initialize formData with empty values
  const [formData, setFormData] = useState({
    refid: "",
    amount: "",
    base_fare: "",
    passenger_phone: "",
    passenger_email: "",
    blockKey: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [response, setResponse] = useState(null);
  const [bookedTickets, setBookedTickets] = useState([]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    setResponse(null);

    try {
      const res = await axios.post("/admin/busTicket/bookticket", formData, {
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
      });

      console.log("Full Response:", res.data);
      setResponse(Array.isArray(res.data) ? res.data : [res.data]);

      if (res.data.status) {
        setSuccess("Ticket booked successfully!");
        // Reset form fields after successful booking
        setFormData({
          refid: "",
          amount: "",
          base_fare: "",
          passenger_phone: "",
          passenger_email: "",
          blockKey: "",
        });
        // Optionally fetch updated ticket list here
        // fetchBookedTickets();
      } else {
        setError(res.data.message || "Failed to book ticket");
      }
    } catch (error) {
      console.error("Error booking ticket:", error.response ? error.response.data : error.message);
      const errorMessage = error.response?.data?.message || "Failed to book ticket";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-full">
        <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
          <div className="bg-gradient-to-tr from-gray-400 to-black py-4 px-6">
            <h2 className="text-3xl font-semibold text-white">Book Ticket</h2>
          </div>

          <form onSubmit={handleSubmit} className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label htmlFor="refid" className="flex items-center text-sm font-medium text-gray-600 mb-1">
                  <Ticket size={20} className="mr-2 text-green-500" />
                  Reference ID
                </label>
                <input
                  id="refid"
                  type="number"
                  name="refid"
                  value={formData.refid}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all"
                  required
                  placeholder="Enter Reference ID"
                />
              </div>

              <div>
                <label htmlFor="amount" className="flex items-center text-sm font-medium text-gray-600 mb-1">
                  <Banknote size={20} className="mr-2 text-blue-500" />
                  Amount
                </label>
                <input
                  id="amount"
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all"
                  required
                  min="1"
                  placeholder="Enter Amount"
                />
              </div>

              <div>
                <label htmlFor="base_fare" className="flex items-center text-sm font-medium text-gray-600 mb-1">
                  <Banknote size={20} className="mr-2 text-blue-500" />
                  Base Fare
                </label>
                <input
                  id="base_fare"
                  type="text"
                  name="base_fare"
                  value={formData.base_fare}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all"
                  required
                  placeholder="Enter Base Fare"
                />
              </div>

              <div>
                <label htmlFor="passenger_phone" className="flex items-center text-sm font-medium text-gray-600 mb-1">
                  <Phone size={20} className="mr-2 text-yellow-500" />
                  Passenger Phone
                </label>
                <input
                  id="passenger_phone"
                  type="text"
                  name="passenger_phone"
                  value={formData.passenger_phone}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all"
                  required
                  placeholder="Enter Phone Number"
                />
              </div>

              <div>
                <label htmlFor="passenger_email" className="flex items-center text-sm font-medium text-gray-600 mb-1">
                  <Mail size={20} className="mr-2 text-purple-500" />
                  Passenger Email
                </label>
                <input
                  id="passenger_email"
                  type="email"
                  name="passenger_email"
                  value={formData.passenger_email}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all"
                  required
                  placeholder="Enter Email"
                />
              </div>

              <div>
                <label htmlFor="blockKey" className="flex items-center text-sm font-medium text-gray-600 mb-1">
                  <Code size={20} className="mr-2 text-red-500" />
                  Block Key
                </label>
                <input
                  id="blockKey"
                  type="text"
                  name="blockKey"
                  value={formData.blockKey}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all"
                  required
                  placeholder="Enter Block Key"
                />
              </div>
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
                  Booking...
                </span>
              ) : "Book Ticket"}
            </button>
          </form>

          {/* Response and error handling */}
          <div className="px-6 pb-6">
            {error && (
              <div className="mt-4 p-4 bg-red-50 border border-red-100 rounded-lg">
                <p className="text-red-600 text-sm flex items-center">
                  <AlertCircle size={16} className="mr-2" />
                  {error}
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

            {response && (
              <div className="mt-4">
                <h3 className="font-medium text-sm text-gray-700 mb-2 flex items-center">
                  <Code size={16} className="mr-2" />
                  API Response:
                </h3>
                <div className="border border-gray-200 rounded-lg shadow-md overflow-hidden">
                  <Table className="w-full border-collapse">
                    <TableHeader className="bg-sky-500 text-white">
                      <TableRow>
                        <TableHead className="px-4 py-2 text-left">Key</TableHead>
                        <TableHead className="px-4 py-2 text-left">Value</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {Object.entries(response[0]).map(([key, value]) => (
                        <TableRow key={key} className="border-b border-gray-200">
                          <TableCell className="px-4 py-2 font-medium">{key}</TableCell>
                          <TableCell className="px-4 py-2">{String(value)}</TableCell>
                        </TableRow>
                      ))}
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

export default BookTicket;