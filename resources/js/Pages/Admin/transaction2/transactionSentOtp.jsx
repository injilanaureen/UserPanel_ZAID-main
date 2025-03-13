import React, { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { router } from '@inertiajs/react';
import { User, Hash, CreditCard, AlertCircle, CheckCircle, Code, MapPin, Calendar, File, ArrowRight } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const TransactionSentOtp = ({ response }) => {
  const [formData, setFormData] = useState({
    mobile: '',
    referenceid: '',
    bene_id: '',
    txntype: 'IMPS',
    amount: '',
    pincode: '',
    address: '',
    gst_state: '',
    dob: '',
    lat: '28.7041',
    long: '77.1025',
  });

  const [apiResponse, setApiResponse] = useState(response || null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState("");

  // Map field names to icons
  const fieldIcons = {
    mobile: <User size={20} className="mr-2 text-yellow-500" />,
    referenceid: <Hash size={20} className="mr-2 text-purple-500" />,
    bene_id: <User size={20} className="mr-2 text-indigo-500" />,
    txntype: <ArrowRight size={20} className="mr-2 text-green-500" />,
    amount: <CreditCard size={20} className="mr-2 text-blue-500" />,
    pincode: <MapPin size={20} className="mr-2 text-red-500" />,
    address: <MapPin size={20} className="mr-2 text-orange-500" />,
    gst_state: <MapPin size={20} className="mr-2 text-teal-500" />,
    dob: <Calendar size={20} className="mr-2 text-pink-500" />,
  };

  // Handle input change
  const handleChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
    setError(null);
    setSuccess("");
  };

  // Handle form submit
  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess("");
    setApiResponse(null);

    router.post('/transaction-sent-otp', formData, {
      preserveState: true,
      onSuccess: (page) => {
        console.log("API Response:", page.props.response); 
        setLoading(false);
        setApiResponse(page.props.response);
        setSuccess("OTP sent successfully!");
      },
      onError: (errors) => {
        setLoading(false);
        setError('Something went wrong. Please try again.');
      },
    });
  };

  return (
    <AdminLayout>
      <div className="max-w-full">
        <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
        <div className="bg-gradient-to-tr from-gray-400 to-black py-4 px-6">
      <h2 className="text-3xl font-semibold text-white">Transaction Sent Otp </h2>
        </div>



          <form onSubmit={handleSubmit} className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {Object.keys(formData).map((key) => (
                key !== 'lat' && key !== 'long' && (
                  <div key={key}>
                    <label htmlFor={key} className="flex items-center text-sm font-medium text-gray-600 mb-1">
                      {fieldIcons[key] || <File size={20} className="mr-2 text-gray-500" />}
                      {key.replace('_', ' ').charAt(0).toUpperCase() + key.replace('_', ' ').slice(1)}
                    </label>
                    {key === 'txntype' ? (
                      <select
                        id={key}
                        name={key}
                        value={formData[key]}
                        onChange={(e) => handleChange(key, e.target.value)}
                        className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all"
                        required
                      >
                        <option value="IMPS">IMPS</option>
                        <option value="NEFT">NEFT</option>
                        <option value="RTGS">RTGS</option>
                      </select>
                    ) : (
                      <input
                        type={key === 'amount' ? 'number' : key === 'dob' ? 'date' : 'text'}
                        id={key}
                        name={key}
                        value={formData[key]}
                        onChange={(e) => handleChange(key, e.target.value)}
                        className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all"
                        required
                        min={key === 'amount' ? "1" : undefined}
                        placeholder={`Enter ${key.replace('_', ' ')}`}
                      />
                    )}
                  </div>
                )
              ))}
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
                  Sending OTP...
                </span>
              ) : "Send OTP"}
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

            {apiResponse && (
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
                      {Object.entries(apiResponse).map(([key, value]) => (
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

export default TransactionSentOtp;