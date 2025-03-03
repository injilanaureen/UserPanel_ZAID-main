import React, { useState, useEffect } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { router, useForm } from '@inertiajs/react';
import axios from 'axios';

const CustomAlert = ({ type, message }) => (
  <div className={`mb-4 p-4 rounded-lg shadow-md border-l-4 ${type === 'success' ? 'bg-green-100 border-green-500 text-green-800' : 'bg-red-100 border-red-500 text-red-800'}`}>
    {message}
  </div>
);

const DeletionHistory = ({ data }) => (
  <div className="mt-8 bg-white shadow-lg rounded-lg p-6">
    <h3 className="text-xl font-semibold mb-4">Deletion History</h3>
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border rounded-lg">
        <thead>
          <tr className="bg-gray-100 text-gray-700">
            <th className="px-6 py-3 text-left">Mobile</th>
            <th className="px-6 py-3 text-left">Bene ID</th>
            <th className="px-6 py-3 text-left">Status</th>
            <th className="px-6 py-3 text-left">Response Code</th>
            <th className="px-6 py-3 text-left">Message</th>
            <th className="px-6 py-3 text-left">Date</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={index} className="hover:bg-gray-50 border-t">
              <td className="px-6 py-4">{item.mobile}</td>
              <td className="px-6 py-4">{item.bene_id}</td>
              <td className="px-6 py-4">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${item.status ? 'bg-green-200 text-green-900' : 'bg-red-200 text-red-900'}`}>
                  {item.status ? 'Success' : 'Failed'}
                </span>
              </td>
              <td className="px-6 py-4">{item.response_code}</td>
              <td className="px-6 py-4">{item.message}</td>
              <td className="px-6 py-4">{new Date(item.created_at).toLocaleString()}</td>
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
          setData({ mobile: '', bene_id: '' });
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
      <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
        <h2 className="text-2xl font-bold mb-6">Delete Beneficiary</h2>

        {apiMessage && <CustomAlert type={apiSuccess ? 'success' : 'error'} message={apiMessage} />}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Mobile Number:</label>
            <input
              type="text"
              name="mobile"
              value={data.mobile}
              onChange={handleChange}
              className="w-full rounded-lg border-gray-300 p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
              placeholder="Enter 10-digit mobile number"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Beneficiary ID:</label>
            <input
              type="text"
              name="bene_id"
              value={data.bene_id}
              onChange={handleChange}
              className="w-full rounded-lg border-gray-300 p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
              placeholder="Enter beneficiary ID"
            />
          </div>

          <button
            type="submit"
            disabled={processing}
            className="w-full bg-red-500 hover:bg-red-600 text-white font-medium py-3 px-4 rounded-lg shadow-md transition disabled:opacity-50"
          >
            {processing ? 'Processing...' : 'Delete Beneficiary'}
          </button>
        </form>

        <DeletionHistory data={deletionHistory} />

        {showConfirmation && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg p-6 shadow-lg max-w-md w-full">
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
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
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
