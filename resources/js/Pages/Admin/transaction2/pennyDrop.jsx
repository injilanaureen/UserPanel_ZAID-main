import React, { useState } from 'react';
import { useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

const PennyDrop = ({ apiResponse }) => {
  const { data, setData, post, processing } = useForm({
    mobile: '',
    accno: '',
    bankid: '',
    benename: '',
    referenceid: '',
    pincode: '',
    address: '',
    dob: '',
    gst_state: '',
    bene_id: '',
  });

  const [responseData, setResponseData] = useState(null);

  // Handle date input change with format conversion
  const handleDateChange = (e) => {
    const dateValue = e.target.value; // This will be in YYYY-MM-DD format
    
    if (dateValue) {
      // Convert from YYYY-MM-DD to DD-MM-YYYY
      const [year, month, day] = dateValue.split('-');
      const formattedDate = `${day}-${month}-${year}`;
      setData('dob', formattedDate);
    } else {
      setData('dob', '');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    post(route('transaction2.pennyDrop'), {
      onSuccess: (response) => {
        setResponseData(response.props.apiResponse);
      },
    });
  };

  // Convert from DD-MM-YYYY to YYYY-MM-DD for the date input value
  const getDateInputValue = () => {
    if (!data.dob) return '';
    
    // Check if the date is already in DD-MM-YYYY format
    if (data.dob.includes('-')) {
      const parts = data.dob.split('-');
      // If it's DD-MM-YYYY format
      if (parts.length === 3 && parts[0].length === 2) {
        const [day, month, year] = parts;
        return `${year}-${month}-${day}`;
      }
    }
    
    return data.dob; // Return as is if not in expected format
  };

  return (
    <AdminLayout>
      <div className="p-8 bg-gray-50 min-h-screen">
        <h1 className="text-3xl font-extrabold text-gray-800 mb-8">Penny Drop Form</h1>

        {/* Form Section */}
        <div className="bg-white p-8 rounded-2xl shadow-lg max-w-4xl mx-auto">
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { name: 'mobile', label: 'Mobile Number', type: 'text', placeholder: 'Enter mobile number' },
              { name: 'accno', label: 'Account Number', type: 'text', placeholder: 'Enter account number' },
              { name: 'bankid', label: 'Bank ID', type: 'number', placeholder: 'Enter bank ID' },
              { name: 'benename', label: 'Beneficiary Name', type: 'text', placeholder: 'Enter beneficiary name' },
              { name: 'referenceid', label: 'Reference ID', type: 'text', placeholder: 'Enter reference ID' },
              { name: 'pincode', label: 'Pincode', type: 'text', placeholder: 'Enter pincode' },
              { name: 'address', label: 'Address', type: 'text', placeholder: 'Enter address' },
              // We'll handle the date field separately
              { name: 'gst_state', label: 'GST State Code', type: 'text', placeholder: 'e.g., 07' },
              { name: 'bene_id', label: 'Beneficiary ID', type: 'number', placeholder: 'Enter beneficiary ID' },
            ].map((field) => (
              <div key={field.name}>
                <label className="block font-semibold text-gray-700 mb-2">{field.label}</label>
                <input
                  type={field.type}
                  name={field.name}
                  value={data[field.name]}
                  onChange={(e) => setData(field.name, e.target.value)}
                  placeholder={field.placeholder}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  required
                />
              </div>
            ))}

            {/* Date of Birth field with date input */}
            <div>
              <label className="block font-semibold text-gray-700 mb-2">Date of Birth</label>
              <input
                type="date"
                name="dob"
                value={getDateInputValue()}
                onChange={handleDateChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                required
              />
              <p className="text-sm text-gray-500 mt-1">Format: DD-MM-YYYY will be sent to the API</p>
            </div>

            <div className="md:col-span-2 flex justify-end mt-4">
              <button
                type="submit"
                className="bg-blue-600 text-white px-8 py-3 rounded-xl hover:bg-blue-700 transition-transform transform hover:scale-105 disabled:opacity-50"
                disabled={processing}
              >
                {processing ? 'Submitting...' : 'Submit'}
              </button>
            </div>
          </form>
        </div>

        {/* API Response Table */}
        {responseData && (
          <div className="mt-12 max-w-4xl mx-auto">
            <h2 className="text-2xl font-semibold mb-4">API Response:</h2>
            <div className="overflow-x-auto rounded-lg shadow-lg">
              <table className="min-w-full bg-white border border-gray-200">
                <thead className="bg-blue-600 text-white">
                  <tr>
                    <th className="px-6 py-3 text-left">Field</th>
                    <th className="px-6 py-3 text-left">Value</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-300">
                  {Object.entries(responseData).map(([key, value]) => (
                    <tr key={key} className="hover:bg-gray-100">
                      <td className="px-6 py-4 font-medium">{key}</td>
                      <td className="px-6 py-4">{value?.toString() || 'N/A'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default PennyDrop;