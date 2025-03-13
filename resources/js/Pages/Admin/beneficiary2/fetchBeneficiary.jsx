import React, { useState, useEffect } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { usePage, router } from '@inertiajs/react';
import { Phone, AlertCircle, CheckCircle, Table as TableIcon } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const FetchBeneficiary = () => {
  const { beneficiaryData, mobile, error: serverError } = usePage().props;
  const [mobileNumber, setMobileNumber] = useState(mobile || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(serverError || "");
  const [success, setSuccess] = useState("");

  // Set error from server props if it exists
  useEffect(() => {
    if (serverError) {
      setError(serverError);
      setSuccess("");
    } else if (beneficiaryData && mobile) {
      setError("");
      setSuccess("Beneficiaries fetched successfully!");
    }
  }, [serverError, beneficiaryData, mobile]);

  // Handle form submission to fetch beneficiary details
  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    router.get(
      '/admin/beneficiary2/fetch', 
      { mobile: mobileNumber },
      {
        onSuccess: () => {
          setLoading(false);
          // Success message will be set by the useEffect if there's data
        },
        onError: (err) => {
          setError(err.message || "Failed to fetch beneficiaries");
          setLoading(false);
        }
      }
    );
  };

  return (
    <AdminLayout>
      <div className="max-w-full p-6">
        <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
          <div className="bg-gradient-to-tr from-gray-400 to-black py-4 px-6">
            <h2 className="text-3xl font-semibold text-white">Fetch Beneficiary</h2>
          </div>

          {/* Mobile Number Input Form */}
          <form onSubmit={handleSubmit} className="p-6">
            <div className="grid grid-cols-1 gap-6 mb-6">
              <div>
                <label htmlFor="mobileNumber" className="flex items-center text-sm font-medium text-gray-600 mb-1">
                  <Phone size={20} className="mr-2 text-yellow-500" />
                  Mobile Number
                </label>
                <input
                  id="mobileNumber"
                  type="text"
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value)}
                  placeholder="Enter Mobile Number"
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all"
                  required
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
                  Fetching...
                </span>
              ) : "Fetch Beneficiary"}
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

            {/* Display Beneficiary Data */}
            {beneficiaryData && beneficiaryData.length > 0 ? (
              <div className="mt-4">
                <h3 className="font-medium text-sm text-gray-700 mb-2 flex items-center">
                  <TableIcon size={16} className="mr-2" />
                  Beneficiary Details:
                </h3>
                <div className="border border-gray-200 rounded-lg shadow-md overflow-hidden">
                  <Table className="w-full border-collapse">
                    <TableHeader className="bg-sky-500 text-white">
                      <TableRow>
                        <TableHead className="px-4 py-2 text-left">Beneficiary ID</TableHead>
                        <TableHead className="px-4 py-2 text-left">Bank ID</TableHead>
                        <TableHead className="px-4 py-2 text-left">Bank Name</TableHead>
                        <TableHead className="px-4 py-2 text-left">Name</TableHead>
                        <TableHead className="px-4 py-2 text-left">Account Number</TableHead>
                        <TableHead className="px-4 py-2 text-left">IFSC</TableHead>
                        <TableHead className="px-4 py-2 text-left">Verified</TableHead>
                        <TableHead className="px-4 py-2 text-left">Bank Type</TableHead>
                        <TableHead className="px-4 py-2 text-left">Paytm Supported</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {beneficiaryData.map((beneficiary) => (
                        <TableRow key={beneficiary.bene_id} className="hover:bg-gray-50 border-b border-gray-200">
                          <TableCell className="px-4 py-2">{beneficiary.bene_id || 'N/A'}</TableCell>
                          <TableCell className="px-4 py-2">{beneficiary.bankid || 'N/A'}</TableCell>
                          <TableCell className="px-4 py-2">{beneficiary.bankname || 'N/A'}</TableCell>
                          <TableCell className="px-4 py-2">{beneficiary.name || 'N/A'}</TableCell>
                          <TableCell className="px-4 py-2">{beneficiary.accno || 'N/A'}</TableCell>
                          <TableCell className="px-4 py-2">{beneficiary.ifsc || 'N/A'}</TableCell>
                          <TableCell className="px-4 py-2">{beneficiary.verified ? 'Yes' : 'No'}</TableCell>
                          <TableCell className="px-4 py-2">{beneficiary.banktype || 'N/A'}</TableCell>
                          <TableCell className="px-4 py-2">{beneficiary.paytm ? 'Yes' : 'No'}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            ) : mobile && success ? (
              <div className="mt-4 p-4 bg-yellow-50 border border-yellow-100 rounded-lg">
                <p className="text-yellow-600 text-sm flex items-center">
                  <AlertCircle size={16} className="mr-2" />
                  No beneficiaries found for this mobile number.
                </p>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default FetchBeneficiary;