import React, { useState, useEffect } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { router, useForm } from '@inertiajs/react';
import axios from 'axios';
import { Phone, UserX, CheckCircle, AlertCircle, Trash2 } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const CustomAlert = ({ type, message }) => (
  <div className={`p-4 rounded-lg ${type === 'success' ? 'bg-green-50 border border-green-100 text-green-600' : 'bg-red-50 border border-red-100 text-red-600'}`}>
    <p className="text-sm flex items-center">
      {type === 'success' ? <CheckCircle size={16} className="mr-2" /> : <AlertCircle size={16} className="mr-2" />}
      {message}
    </p>
  </div>
);

const DeletionHistory = ({ data }) => (
  <div>
    <h3 className="text-xl font-semibold text-gray-700 mb-4">Deletion History</h3>
    {data.length === 0 ? (
      <p className="text-gray-500 text-sm">No deletion history available.</p>
    ) : (
      <div className="border border-gray-200 rounded-lg shadow-md overflow-hidden">
        <Table className="w-full border-collapse">
          <TableHeader className="bg-sky-500 text-white">
            <TableRow>
              <TableHead className="px-4 py-2 text-left">Mobile</TableHead>
              <TableHead className="px-4 py-2 text-left">Bene ID</TableHead>
              <TableHead className="px-4 py-2 text-left">Status</TableHead>
              <TableHead className="px-4 py-2 text-left">Response Code</TableHead>
              <TableHead className="px-4 py-2 text-left">Message</TableHead>
              <TableHead className="px-4 py-2 text-left">Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item, index) => (
              <TableRow key={index} className="border-b border-gray-200">
                <TableCell className="px-4 py-2">{item.mobile}</TableCell>
                <TableCell className="px-4 py-2">{item.bene_id}</TableCell>
                <TableCell className="px-4 py-2">
                  <span className={`text-sm ${item.status ? 'text-green-600' : 'text-red-600'}`}>
                    {item.status ? 'Success' : 'Failed'}
                  </span>
                </TableCell>
                <TableCell className="px-4 py-2">{item.response_code}</TableCell>
                <TableCell className="px-4 py-2">{item.message}</TableCell>
                <TableCell className="px-4 py-2">{new Date(item.created_at).toLocaleString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    )}
  </div>
);

const DeleteBeneficiary = () => {
  const [activeTab, setActiveTab] = useState('delete'); // Tab state
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
          setActiveTab('history'); // Switch to history tab on success
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
      <div className="max-w-full p-6">
        <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
          <div className="bg-gradient-to-tr from-gray-400 to-black py-4 px-6">
            <h2 className="text-3xl font-semibold text-white">Delete Beneficiary</h2>
          </div>

          {/* Tab Navigation */}
          <div className="flex border-b border-gray-200 px-6 pt-4">
            <button
              className={`py-2 px-4 text-sm font-medium ${
                activeTab === 'delete'
                  ? 'border-b-2 border-gray-800 text-gray-800'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('delete')}
            >
              Delete Beneficiary
            </button>
            <button
              className={`py-2 px-4 text-sm font-medium ${
                activeTab === 'history'
                  ? 'border-b-2 border-gray-800 text-gray-800'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('history')}
            >
              Deletion History
            </button>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'delete' && (
              <div>
                {apiMessage && <CustomAlert type={apiSuccess ? 'success' : 'error'} message={apiMessage} />}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="mobile" className="flex items-center text-sm font-medium text-gray-600 mb-1">
                      <Phone size={20} className="mr-2 text-yellow-500" />
                      Mobile Number
                    </label>
                    <input
                      id="mobile"
                      type="text"
                      name="mobile"
                      value={data.mobile}
                      onChange={handleChange}
                      className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all"
                      placeholder="Enter 10-digit mobile number"
                    />
                  </div>

                  <div>
                    <label htmlFor="bene_id" className="flex items-center text-sm font-medium text-gray-600 mb-1">
                      <UserX size={20} className="mr-2 text-red-500" />
                      Beneficiary ID
                    </label>
                    <input
                      id="bene_id"
                      type="text"
                      name="bene_id"
                      value={data.bene_id}
                      onChange={handleChange}
                      className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all"
                      placeholder="Enter beneficiary ID"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={processing}
                    className="w-full bg-red-600 text-white py-3 px-4 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                  >
                    {processing ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processing...
                      </span>
                    ) : (
                      <span className="flex items-center justify-center">
                        <Trash2 size={20} className="mr-2" />
                        Delete Beneficiary
                      </span>
                    )}
                  </button>
                </form>
              </div>
            )}

            {activeTab === 'history' && <DeletionHistory data={deletionHistory} />}
          </div>

          {/* Confirmation Modal */}
          {showConfirmation && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-lg p-6 shadow-lg max-w-md w-full">
                <h3 className="text-lg font-medium text-gray-800 mb-4 flex items-center">
                  <AlertCircle size={20} className="mr-2 text-red-500" />
                  Confirm Deletion
                </h3>
                <p className="text-gray-600 mb-6">Are you sure you want to delete this beneficiary? This action cannot be undone.</p>
                <div className="flex justify-end space-x-4">
                  <button
                    onClick={() => setShowConfirmation(false)}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800 rounded-lg border border-gray-200 hover:bg-gray-50 transition"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmDelete}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 transition"
                  >
                    Confirm Delete
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default DeleteBeneficiary;