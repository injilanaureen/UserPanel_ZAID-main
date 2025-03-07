import React, { useState } from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import { router } from '@inertiajs/react';

const RemitterAdhaarApiVerify = ({ apiData, dbData, error }) => {
  const [formData, setFormData] = useState({
    mobile: '',
    aadhaar_no: ''
  });
  const [loading, setLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  const validateForm = () => {
    const errors = {};
    if (!formData.mobile || !/^[0-9]{10}$/.test(formData.mobile)) {
      errors.mobile = 'Please enter a valid 10-digit mobile number';
    }
    if (!formData.aadhaar_no || !/^[0-9]{12}$/.test(formData.aadhaar_no)) {
      errors.aadhaar_no = 'Please enter a valid Aadhaar number';
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

    router.post('/admin/remitter-adhaar-verify', formData, {
      preserveState: true,
      preserveScroll: true,
      onFinish: () => setLoading(false)
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (/^\d*$/.test(value)) {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const renderApiResponse = () => {
    if (!apiData) return null;

    return (
      <div className="mt-6">
        <h3 className="text-xl font-semibold mb-4">API Response</h3>
        <div className="overflow-x-auto bg-white shadow-md rounded-lg">
          <table className="min-w-full table-auto text-sm">
            <thead className="bg-gray-100 border-b">
              <tr>
                <th className="py-3 px-6 text-left font-medium text-gray-700">Field</th>
                <th className="py-3 px-6 text-left font-medium text-gray-700">Value</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(apiData).map(([key, value]) => (
                <tr key={key} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-6 text-gray-700 font-medium">
                    {key.replace(/_/g, ' ').toUpperCase()}
                  </td>
                  <td className="py-3 px-6 text-gray-600">
                    {typeof value === 'object' ? JSON.stringify(value) : value.toString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const renderDbResponse = () => {
    if (!dbData) return null;

    const displayFields = [
      { key: 'id', label: 'Record ID' },
      { key: 'status', label: 'Status' },
      { key: 'message', label: 'Message' },
      { key: 'mobile', label: 'Mobile Number' },
      { key: 'aadhaar_no', label: 'Aadhaar Number' },
      { key: 'response_code', label: 'Response Code' },
      { key: 'created_at', label: 'Created At' },
      { key: 'updated_at', label: 'Updated At' }
    ];

    return (
      <div className="mt-6">
        <h3 className="text-xl font-semibold mb-4">Stored Database Record</h3>
        <div className="overflow-x-auto bg-white shadow-md rounded-lg">
          <table className="min-w-full table-auto text-sm">
            <thead className="bg-gray-100 border-b">
              <tr>
                <th className="py-3 px-6 text-left font-medium text-gray-700">Field</th>
                <th className="py-3 px-6 text-left font-medium text-gray-700">Value</th>
              </tr>
            </thead>
            <tbody>
              {displayFields.map(({ key, label }) => (
                <tr key={key} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-6 text-gray-700 font-medium">{label}</td>
                  <td className="py-3 px-6 text-gray-600">
                    {key.includes('_at') 
                      ? new Date(dbData[key]).toLocaleString()
                      : dbData[key]}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Remitter Aadhaar Verification</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2 text-gray-700">
              Mobile Number
            </label>
            <input
              type="text"
              name="mobile"
              value={formData.mobile}
              onChange={handleChange}
              maxLength={10}
              placeholder="Enter 10-digit mobile number"
              className={`w-full p-3 border rounded-md text-gray-800 ${
                validationErrors.mobile ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {validationErrors.mobile && (
              <p className="text-red-500 text-sm mt-2">{validationErrors.mobile}</p>
            )}
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium mb-2 text-gray-700">
              Aadhaar Number
            </label>
            <input
              type="text"
              name="aadhaar_no"
              value={formData.aadhaar_no}
              onChange={handleChange}
              maxLength={12}
              placeholder="Enter Aadhaar number"
              className={`w-full p-3 border rounded-md text-gray-800 ${
                validationErrors.aadhaar_no ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {validationErrors.aadhaar_no && (
              <p className="text-red-500 text-sm mt-2">{validationErrors.aadhaar_no}</p>
            )}
          </div>

          <button 
            type="submit" 
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? 'Verifying...' : 'Verify Aadhaar'}
          </button>
        </form>

        {error && (
          <div className="mt-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-md">
            {error}
          </div>
        )}

        {renderApiResponse()}
        {renderDbResponse()}
      </div>
    </AdminLayout>
  );
};

export default RemitterAdhaarApiVerify;