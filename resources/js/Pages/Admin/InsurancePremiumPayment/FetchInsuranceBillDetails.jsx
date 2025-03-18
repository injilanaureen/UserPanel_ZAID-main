import { useState } from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import axios from "axios";
import { Phone, Mail, Calendar, AlertCircle, CheckCircle, Code } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const FetchInsuranceBillDetails = () => {
  const [formData, setFormData] = useState({
    canumber: "",
    ad1: "",
    ad2: "",
    mode: "online",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [billDetails, setBillDetails] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "ad2") {
      let formattedValue = value.replace(/[^0-9/]/g, "");
      if (formattedValue.length === 2 || formattedValue.length === 5) {
        if (!formattedValue.endsWith("/")) {
          formattedValue += "/";
        }
      }
      if (formattedValue.length > 10) {
        formattedValue = formattedValue.slice(0, 10);
      }
      setFormData((prev) => ({ ...prev, [name]: formattedValue }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setBillDetails(null);

    const datePattern = /^(\d{2})\/(\d{2})\/(\d{4})$/;
    if (!datePattern.test(formData.ad2)) {
      setError("Please enter the date in dd/mm/yyyy format.");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        "/admin/InsurancePremiumPayment/fetch-lic-bill",
        formData
      );
      console.log("Full API Response:", response);
      console.log("API Response:", response.data);
      setBillDetails(response.data);
      if (response.data.status) {
        setFormData({ canumber: "", ad1: "", ad2: "", mode: "offline" });
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Failed to fetch bill details";
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
            <h2 className="text-3xl font-semibold text-white">Fetch Insurance Bill Details</h2>
          </div>

          <form onSubmit={handleSubmit} className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label htmlFor="canumber" className="flex items-center text-sm font-medium text-gray-600 mb-1">
                  <Phone size={20} className="mr-2 text-yellow-500" />
                  CA Number
                </label>
                <input
                  id="canumber"
                  type="number"
                  name="canumber"
                  value={formData.canumber}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all"
                  required
                  placeholder="Enter CA Number"
                />
              </div>

              <div>
                <label htmlFor="ad1" className="flex items-center text-sm font-medium text-gray-600 mb-1">
                  <Mail size={20} className="mr-2 text-blue-500" />
                  Email
                </label>
                <input
                  id="ad1"
                  type="email"
                  name="ad1"
                  value={formData.ad1}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all"
                  required
                  placeholder="Enter Email"
                />
              </div>

              <div>
                <label htmlFor="ad2" className="flex items-center text-sm font-medium text-gray-600 mb-1">
                  <Calendar size={20} className="mr-2 text-green-500" />
                  Date (dd/mm/yyyy)
                </label>
                <input
                  id="ad2"
                  type="text"
                  name="ad2"
                  value={formData.ad2}
                  onChange={handleChange}
                  placeholder="dd/mm/yyyy"
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all"
                  required
                />
              </div>

              <div>
                <label htmlFor="mode" className="flex items-center text-sm font-medium text-gray-600 mb-1">
                  <CheckCircle size={20} className="mr-2 text-purple-500" />
                  Mode
                </label>
                <select
                  id="mode"
                  name="mode"
                  value={formData.mode}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all"
                  required
                >
                  <option value="online">Online</option>
                  <option value="offline">Offline</option>
                </select>
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
                  Fetching...
                </span>
              ) : "Fetch Bill Details"}
            </button>
          </form>

          <div className="px-6 pb-6">
            {error && (
              <div className="mt-4 p-4 bg-red-50 border border-red-100 rounded-lg">
                <p className="text-red-600 text-sm flex items-center">
                  <AlertCircle size={16} className="mr-2" />
                  {error}
                </p>
              </div>
            )}

            {billDetails && (
              <div className="mt-4">
                <h3 className="font-medium text-sm text-gray-700 mb-2 flex items-center">
                  <Code size={16} className="mr-2" />
                  Bill Details:
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
                      {Object.entries({
                        "Customer Name": billDetails.name || "N/A",
                        "Bill Amount": billDetails.bill_fetch?.billAmount || "N/A",
                        "Net Amount": billDetails.bill_fetch?.billnetamount || "N/A",
                        "Due Date": billDetails.bill_fetch?.dueDate || "N/A",
                        "Max Bill Amount": billDetails.bill_fetch?.maxBillAmount || "N/A",
                        "Accept Payment": billDetails.bill_fetch?.acceptPayment ? "Yes" : "No",
                        "Accept Part Pay": billDetails.bill_fetch?.acceptPartPay ? "Yes" : "No",
                        "Cell Number": billDetails.bill_fetch?.cellNumber || "N/A",
                        "Email (ad1)": billDetails.ad1 || "N/A",
                        "Additional Field (ad2)": billDetails.ad2 || "N/A",
                        "Status Message": billDetails.message || "N/A",
                      }).map(([key, value]) => (
                        <TableRow key={key} className="border-b border-gray-200">
                          <TableCell className="px-4 py-2 font-medium">{key}</TableCell>
                          <TableCell className={`px-4 py-2 ${key.includes("Accept") ? value === "Yes" ? "text-green-600" : "text-red-600" : ""}`}>
                            {String(value)}
                          </TableCell>
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

export default FetchInsuranceBillDetails;