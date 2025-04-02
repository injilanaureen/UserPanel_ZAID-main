import React, { useState, useEffect } from 'react';
import { router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Phone, Banknote, AlertCircle, CheckCircle, Code, Mail, Send, MapPin, Calendar, Home, Hash } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const Transaction = ({ transactionData }) => {
  const [formData, setFormData] = useState({
    mobile: '',
    referenceid: '',
    pincode: '',
    address: '',
    amount: '',
    txntype: 'imps',
    dob: '',
    gst_state: '',
    bene_id: '',
    otp: '',
    stateresp: '',
    lat: '28.7041',
    long: '77.1025',
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setFormData(prev => ({
            ...prev,
            lat: latitude.toString(),
            long: longitude.toString()
          }));
        },
        (err) => {
          console.log("Failed to fetch location: " + err.message);
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0
        }
      );
    }
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
    setSuccess("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // console.log("Form data:", formData);
    setLoading(true);
    setError("");
    setSuccess("");

    router.post('/admin/transaction2/transact', formData, {
      onSuccess: () => {
        setSuccess("Transaction processed successfully!");
        setLoading(false);
        setFormData({
          mobile: '',
          referenceid: '',
          pincode: '',
          address: '',
          amount: '',
          txntype: 'imps',
          dob: '',
          gst_state: '',
          bene_id: '',
          otp: '',
          stateresp: '',
          lat: formData.lat,
          long: formData.long,
        });
      },
      onError: (errors) => {
        setError(errors.message || "Failed to process transaction");
        setLoading(false);
      }
    });
  };

  const handleSendOtp = () => {
    console.log('Sending OTP for bene_id:', formData.bene_id);
    // Add logic here to hit Transaction send OTP API and update otp and stateresp
  };

  return (
    <AdminLayout>
      <div className="max-w-full">
        <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
          <div className="bg-gradient-to-tr from-gray-400 to-black py-4 px-6">
            <h2 className="text-3xl font-semibold text-white">Transaction</h2>
          </div>

          <form onSubmit={handleSubmit} className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label htmlFor="mobile" className="flex items-center text-sm font-medium text-gray-600 mb-1">
                  <Phone size={20} className="mr-2 text-yellow-500" />
                  Mobile Number
                </label>
                <input
                  id="mobile"
                  type="text"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all"
                  required
                  placeholder="Enter Remitter Mobile Number"
                />
              </div>

              <div>
                <label htmlFor="referenceid" className="flex items-center text-sm font-medium text-gray-600 mb-1">
                  <Hash size={20} className="mr-2 text-orange-500" />
                  Reference ID
                </label>
                <input
                  id="referenceid"
                  type="text"
                  name="referenceid"
                  value={formData.referenceid}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all"
                  required
                  placeholder="Enter Partner Reference Number"
                />
              </div>

              <div>
                <label htmlFor="pincode" className="flex items-center text-sm font-medium text-gray-600 mb-1">
                  <MapPin size={20} className="mr-2 text-red-500" />
                  Pincode
                </label>
                <input
                  id="pincode"
                  type="text"
                  name="pincode"
                  value={formData.pincode}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all"
                  required
                  placeholder="Enter Pincode"
                />
              </div>

              <div>
                <label htmlFor="address" className="flex items-center text-sm font-medium text-gray-600 mb-1">
                  <Home size={20} className="mr-2 text-teal-500" />
                  Address
                </label>
                <input
                  id="address"
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all"
                  required
                  placeholder="Enter Remitter Address"
                />
              </div>

              <div>
                <label htmlFor="amount" className="flex items-center text-sm font-medium text-gray-600 mb-1">
                  <Banknote size={20} className="mr-2 text-blue-500" />
                  Amount
                </label>
                <input
                  id="amount"
                  type="text"
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all"
                  required
                  placeholder="Enter Transaction Amount"
                />
              </div>

              <div>
                <label htmlFor="txntype" className="flex items-center text-sm font-medium text-gray-600 mb-1">
                  <Send size={20} className="mr-2 text-indigo-500" />
                  Transaction Type
                </label>
                <select
                  id="txntype"
                  name="txntype"
                  value={formData.txntype}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all"
                  required
                >
                  <option value="imps">IMPS</option>
                  <option value="neft">NEFT</option>
                </select>
              </div>

              <div>
                <label htmlFor="dob" className="flex items-center text-sm font-medium text-gray-600 mb-1">
                  <Calendar size={20} className="mr-2 text-pink-500" />
                  Date of Birth
                </label>
                <input
                  id="dob"
                  type="date"
                  name="dob"
                  value={formData.dob}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all"
                  required
                  placeholder="DD-MM-YYYY"
                />
              </div>

              <div>
                <label htmlFor="gst_state" className="flex items-center text-sm font-medium text-gray-600 mb-1">
                  <MapPin size={20} className="mr-2 text-cyan-500" />
                  GST State
                </label>
                <input
                  id="gst_state"
                  type="text"
                  name="gst_state"
                  value={formData.gst_state}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all"
                  required
                  placeholder="Enter GST State"
                />
              </div>

              <div>
                <label htmlFor="bene_id" className="flex items-center text-sm font-medium text-gray-600 mb-1">
                  <Mail size={20} className="mr-2 text-green-500" />
                  Beneficiary ID
                </label>
                <input
                  id="bene_id"
                  type="text"
                  name="bene_id"
                  value={formData.bene_id}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all"
                  required
                  placeholder="Enter Beneficiary ID"
                />
              </div>

              <div>
                <label htmlFor="otp" className="flex items-center text-sm font-medium text-gray-600 mb-1">
                  <Code size={20} className="mr-2 text-purple-500" />
                  OTP
                </label>
                <input
                  id="otp"
                  type="text"
                  name="otp"
                  value={formData.otp}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all"
                  required
                  placeholder="Enter OTP from Send OTP API"
                />
              </div>

              <div>
                <label htmlFor="stateresp" className="flex items-center text-sm font-medium text-gray-600 mb-1">
                  <Code size={20} className="mr-2 text-gray-500" />
                  State Response
                </label>
                <input
                  id="stateresp"
                  type="text"
                  name="stateresp"
                  value={formData.stateresp}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all"
                  required
                  placeholder="Enter State Response from Send OTP API"
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
                  Processing...
                </span>
              ) : "Process Transaction"}
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

            {success && (
              <div className="mt-4 p-4 bg-green-50 border border-green-100 rounded-lg">
                <p className="text-green-600 text-sm flex items-center">
                  <CheckCircle size={16} className="mr-2" />
                  {success}
                </p>
              </div>
            )}

            {transactionData && (
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
                      {Object.entries(transactionData).map(([key, value]) => (
                        <TableRow key={key} className="border-b border-gray-200">
                          <TableCell className="px-4 py-2 font-medium">{key}</TableCell>
                          <TableCell className="px-4 py-2">{JSON.stringify(value)}</TableCell>
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

export default Transaction;