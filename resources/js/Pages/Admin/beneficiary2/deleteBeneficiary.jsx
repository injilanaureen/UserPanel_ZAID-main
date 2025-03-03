import React, { useState, useEffect } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { router, useForm } from '@inertiajs/react';
import axios from 'axios';

const CustomAlert = ({ type, message }) => (
  <div className={`mb-4 p-4 rounded-md ${type === 'success' ? 'bg-green-50 border-green-500 text-green-700' : 'bg-red-50 border-red-500 text-red-700'}`}>
    {message}
  </div>
);

const DeletionHistory = ({ data }) => (
  <div className="mt-8">
    <h3 className="text-xl font-bold mb-4">Deletion History</h3>
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-300">
        <thead>
          <tr className="bg-gray-50">
            <th className="px-6 py-3 border-b text-left">Mobile</th>
            <th className="px-6 py-3 border-b text-left">Bene ID</th>
            <th className="px-6 py-3 border-b text-left">Status</th>
            <th className="px-6 py-3 border-b text-left">Response Code</th>
            <th className="px-6 py-3 border-b text-left">Message</th>
            <th className="px-6 py-3 border-b text-left">Date</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={index} className="hover:bg-gray-50">
              <td className="px-6 py-4 border-b">{item.mobile}</td>
              <td className="px-6 py-4 border-b">{item.bene_id}</td>
              <td className="px-6 py-4 border-b">
                <span className={`px-2 py-1 rounded-full text-sm ${item.status ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {item.status ? 'Success' : 'Failed'}
                </span>
              </td>
              <td className="px-6 py-4 border-b">{item.response_code}</td>
              <td className="px-6 py-4 border-b">{item.message}</td>
              <td className="px-6 py-4 border-b">{new Date(item.created_at).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

const DeleteBeneficiary = () => {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [apiMessage, setApiMessage] = useState(null);
  const [apiSuccess, setApiSuccess] = useState(false);
  const [deletionHistory, setDeletionHistory] = useState([]);

  const { data, setData, errors, processing } = useForm({
    mobile: '',
    bene_id: ''
  });

  useEffect(() => {
    fetchDeletionHistory();
  }, []);

  const fetchDeletionHistory = async () => {
    try {
      const response = await axios.get(route('beneficiary2.getDeletionHistory'));
      setDeletionHistory(response.data);
    } catch (error) {
      console.error('Error fetching deletion history:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData(name, value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowConfirmation(true);
  };

  const confirmDelete = () => {
    router.post(route('beneficiary2.destroyBeneficiary'), data, {
      preserveScroll: true,
      onSuccess: (response) => {
        if (response?.props?.flash) {
          setApiMessage(response.props.flash.message);
          setApiSuccess(response.props.flash.status);
          setShowConfirmation(false);
          
          // Clear form data after successful submission
          setData({
            mobile: '',
            bene_id: ''
          });
          
          // Refresh deletion history
          fetchDeletionHistory();
        }
      },
      onError: () => {
        setApiMessage('Failed to delete beneficiary');
        setApiSuccess(false);
        setShowConfirmation(false);
      },
    });
  };
  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto p-6">
        <h2 className="text-2xl font-bold mb-6">Delete Beneficiary</h2>

        {apiMessage && <CustomAlert type={apiSuccess ? 'success' : 'error'} message={apiMessage} />}

        <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Mobile Number:</label>
            <input
              type="text"
              name="mobile"
              value={data.mobile}
              onChange={handleChange}
              className="w-full rounded-md border border-gray-300 p-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter 10-digit mobile number"
            />
            {errors.mobile && <p className="text-red-500 text-sm mt-1">{errors.mobile}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Beneficiary ID:</label>
            <input
              type="text"
              name="bene_id"
              value={data.bene_id}
              onChange={handleChange}
              className="w-full rounded-md border border-gray-300 p-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter beneficiary ID"
            />
            {errors.bene_id && <p className="text-red-500 text-sm mt-1">{errors.bene_id}</p>}
          </div>

          <button
            type="submit"
            disabled={processing}
            className="w-full bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-md transition duration-150 ease-in-out disabled:opacity-50"
          >
            {processing ? 'Processing...' : 'Delete Beneficiary'}
          </button>
        </form>

        <DeletionHistory data={deletionHistory} />

        {showConfirmation && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
              <h3 className="text-lg font-medium mb-4">Confirm Deletion</h3>
              <p className="mb-4">Are you sure you want to delete this beneficiary? This action cannot be undone.</p>
              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => setShowConfirmation(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Confirm Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default DeleteBeneficiary;