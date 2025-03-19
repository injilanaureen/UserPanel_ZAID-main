import React, { useState, useEffect } from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import { router } from '@inertiajs/react';
import { Phone, AlertCircle, CheckCircle, Code } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const RemitterAdhaarApiVerify = ({ apiData: initialApiData, dbData: initialDbData, error: initialError, mobile: initialMobile = '', queryData = null }) => {
  const [formData, setFormData] = useState({
    mobile: initialMobile || '',
    aadhaar_no: ''
  });
  const [loading, setLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [apiData, setApiData] = useState(initialApiData);
  const [dbData, setDbData] = useState(initialDbData);
  const [error, setError] = useState(initialError);

  useEffect(() => {
    if (initialMobile) {
      setFormData((prev) => ({ ...prev, mobile: initialMobile }));
    }
  }, [initialMobile]);

  const validateForm = () => {
    const errors = {};
    if (!formData.mobile || !/^[0-9]{10}$/.test(formData.mobile)) {
      errors.mobile = 'Please enter a valid 10-digit mobile number';
    }
    if (!formData.aadhaar_no || !/^[0-9]{12}$/.test(formData.aadhaar_no)) {
      errors.aadhaar_no = 'Please enter a valid 12-digit Aadhaar number';
    }
    return errors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errors = validateForm();
    
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    setLoading(true);
    setValidationErrors({});
    setError(null);

    router.post('/admin/remitter-adhaar-verify', formData, {
      preserveState: true,
      preserveScroll: true,
      onSuccess: (page) => {
        setApiData(page.props.apiData);
        setDbData(page.props.dbData);
      },
      onError: (errors) => {
        setError('Failed to verify Aadhaar');
      },
      onFinish: () => setLoading(false),
    });
  };

  const handleNextStep = () => {
    router.visit('/admin/remitter2/register-remitter', {
      method: 'get',
      data: {
        mobile: formData.mobile,
        aadhaarData: apiData,
        dbData: dbData,
      },
      preserveState: true,
      preserveScroll: true,
    });
  };

  const formatValue = (value) => {
    if (typeof value === 'object' && value !== null) {
      return JSON.stringify(value);
    }
    return value;
  };

  return (
    <AdminLayout>
      <div className="max-w-full">
        <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
          <div className="bg-gradient-to-tr from-gray-400 to-black py-4 px-6">
            <h2 className="text-3xl font-semibold text-white">Remitter Aadhaar Verification</h2>
          </div>

          <form onSubmit={handleSubmit} className="p-6">
            <div className="grid grid-cols-1 gap-6 mb-6">
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
                  onChange={(e) => setFormData(prev => ({ ...prev, mobile: e.target.value }))}
                  className={`w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all ${
                    validationErrors.mobile ? 'border-red-500' : ''
                  }`}
                  required
                  placeholder="Enter 10-digit mobile number"
                  maxLength={10}
                />
                {validationErrors.mobile && (
                  <p className="text-red-500 text-sm mt-1">{validationErrors.mobile}</p>
                )}
              </div>

              <div>
                <label htmlFor="aadhaar_no" className="flex items-center text-sm font-medium text-gray-600 mb-1">
                  <Code size={20} className="mr-2 text-yellow-500" />
                  Aadhaar Number
                </label>
                <input
                  id="aadhaar_no"
                  type="text"
                  name="aadhaar_no"
                  value={formData.aadhaar_no}
                  onChange={(e) => setFormData(prev => ({ ...prev, aadhaar_no: e.target.value }))}
                  className={`w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all ${
                    validationErrors.aadhaar_no ? 'border-red-500' : ''
                  }`}
                  required
                  placeholder="Enter 12-digit Aadhaar number"
                  maxLength={12}
                />
                {validationErrors.aadhaar_no && (
                  <p className="text-red-500 text-sm mt-1">{validationErrors.aadhaar_no}</p>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !formData.mobile || !formData.aadhaar_no}
              className="w-full bg-gray-800 text-white py-3 px-4 rounded-lg hover:bg-black focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Verifying...
                </span>
              ) : "Verify Aadhaar"}
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

            {apiData && (
              <div className="mt-4">
                <h3 className="font-medium text-sm text-gray-700 mb-2 flex items-center">
                  <Code size={16} className="mr-2" />
                  API Response:
                </h3>
                <div className="border border-gray-200 rounded-lg shadow-md overflow-hidden">
                  <Table className="w-full border-collapse">
                    <TableHeader className="bg-gray-100 text-white">
                      <TableRow>
                        <TableHead className="px-4 py-2 text-left">Field</TableHead>
                        <TableHead className="px-4 py-2 text-left">Value</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {Object.entries(apiData).map(([key, value]) => (
                        <TableRow key={key} className="border-b border-gray-200">
                          <TableCell className="px-4 py-2 font-medium">{key}</TableCell>
                          <TableCell className="px-4 py-2">{formatValue(value)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            )}

            {dbData && (
              <div className="mt-4">
                {/* <h3 className="font-medium text-sm text-gray-700 mb-2 flex items-center">
                  <CheckCircle size={16} className="mr-2" />
                  Stored Database Record:
                </h3>
                <div className="border border-gray-200 rounded-lg shadow-md overflow-hidden">
                  <Table className="w-full border-collapse">
                    <TableHeader className="bg-sky-500 text-white">
                      <TableRow>
                        <TableHead className="px-4 py-2 text-left">Field</TableHead>
                        <TableHead className="px-4 py-2 text-left">Value</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {Object.entries(dbData).map(([key, value]) => (
                        <TableRow key={key} className="border-b border-gray-200">
                          <TableCell className="px-4 py-2 font-medium">{key}</TableCell>
                          <TableCell className="px-4 py-2">
                            {key.includes('_at') 
                              ? new Date(value).toLocaleString()
                              : formatValue(value)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div> */}
                <button
                  onClick={handleNextStep}
                  className="mt-4 w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors font-medium"
                >
                  Next Step: Register Remitter →
                </button>
              </div>
            )}

            {!apiData && !dbData && !error && !loading && (
              <p className="text-gray-500 text-sm italic">
                Enter mobile and Aadhaar numbers and click verify to see details
              </p>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default RemitterAdhaarApiVerify;