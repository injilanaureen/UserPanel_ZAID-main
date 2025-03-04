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

  const handleSubmit = (e) => {
    e.preventDefault();
    post(route('transaction2.pennyDrop'), {
      onSuccess: (response) => {
        setResponseData(response.props.apiResponse);
      },
    });
  };

  return (
    <AdminLayout>
      <div className="p-8 bg-gray-50 min-h-screen">
        <h1 className="text-3xl font-extrabold text-gray-800 mb-8"> Penny Drop Form</h1>

        {/* Form Section */}
        <div className="bg-white p-8 rounded-2xl shadow-lg max-w-4xl mx-auto">
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { name: 'mobile', label: ' Mobile Number', type: 'text', placeholder: 'Enter mobile number' },
              { name: 'accno', label: ' Account Number', type: 'text', placeholder: 'Enter account number' },
              { name: 'bankid', label: ' Bank ID', type: 'number', placeholder: 'Enter bank ID' },
              { name: 'benename', label: ' Beneficiary Name', type: 'text', placeholder: 'Enter beneficiary name' },
              { name: 'referenceid', label: ' Reference ID', type: 'text', placeholder: 'Enter reference ID' },
              { name: 'pincode', label: ' Pincode', type: 'text', placeholder: 'Enter pincode' },
              { name: 'address', label: ' Address', type: 'text', placeholder: 'Enter address' },
              { name: 'dob', label: ' Date of Birth', type: 'text', placeholder: 'dd-mm-yyyy' },
              { name: 'gst_state', label: 'GST State Code', type: 'text', placeholder: 'e.g., 07' },
              { name: 'bene_id', label: ' Beneficiary ID', type: 'number', placeholder: 'Enter beneficiary ID' },
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
            <h2 className="text-2xl font-semibold mb-4"> API Response:</h2>
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
