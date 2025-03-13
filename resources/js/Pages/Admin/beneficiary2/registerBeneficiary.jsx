import { useForm } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { User, Phone, Banknote, Key, CheckCircle, AlertCircle } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const RegisterBeneficiary = ({ beneficiaries = [], success, response, error: serverError }) => {
  const { data, setData, post, processing, reset } = useForm({
    mobile: '',
    benename: '',
    bankid: '',
    accno: '',
    ifsccode: '',
    verified: '0',
  });

  const [activeTab, setActiveTab] = useState('register'); // State for active tab
  const [responseData, setResponseData] = useState(null);
  const [error, setError] = useState(null);

  // Update response data when props change
  useEffect(() => {
    if (response) {
      setResponseData(response);
    }
    if (serverError) {
      setError(serverError);
    }
  }, [response, serverError]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null);
    setResponseData(null);

    post('/beneficiary/register', {
      onSuccess: (page) => {
        if (page.props.success) {
          setResponseData(page.props.response);
          setError(null);
          reset();
          setActiveTab('list'); // Switch to list tab on success
        } else {
          setError(page.props.error || 'Failed to register beneficiary.');
        }
      },
      onError: (errors) => {
        setError('Validation failed: ' + Object.values(errors).join(', '));
      },
    });
  };

  return (
    <AdminLayout>
      <div className="max-w-full p-6">
        <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
          <div className="bg-gradient-to-tr from-gray-400 to-black py-4 px-6">
            <h2 className="text-3xl font-semibold text-white">Register Beneficiary</h2>
          </div>

          {/* Tab Navigation */}
          <div className="flex border-b border-gray-200 px-6 pt-4">
            <button
              className={`py-2 px-4 text-sm font-medium ${
                activeTab === 'register'
                  ? 'border-b-2 border-gray-800 text-gray-800'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('register')}
            >
              Register New
            </button>
            <button
              className={`py-2 px-4 text-sm font-medium ${
                activeTab === 'list'
                  ? 'border-b-2 border-gray-800 text-gray-800'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('list')}
            >
              Beneficiaries List
            </button>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'register' && (
              <div>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="mobile" className="flex items-center text-sm font-medium text-gray-600 mb-1">
                      <Phone size={20} className="mr-2 text-yellow-500" />
                      Mobile Number
                    </label>
                    <input
                      id="mobile"
                      type="text"
                      value={data.mobile}
                      onChange={(e) => setData('mobile', e.target.value)}
                      className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all"
                      required
                      placeholder="Enter Mobile Number"
                    />
                  </div>

                  <div>
                    <label htmlFor="benename" className="flex items-center text-sm font-medium text-gray-600 mb-1">
                      <User size={20} className="mr-2 text-green-500" />
                      Beneficiary Name
                    </label>
                    <input
                      id="benename"
                      type="text"
                      value={data.benename}
                      onChange={(e) => setData('benename', e.target.value)}
                      className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all"
                      required
                      placeholder="Enter Beneficiary Name"
                    />
                  </div>

                  <div>
                    <label htmlFor="bankid" className="flex items-center text-sm font-medium text-gray-600 mb-1">
                      <Banknote size={20} className="mr-2 text-blue-500" />
                      Bank ID
                    </label>
                    <input
                      id="bankid"
                      type="text"
                      value={data.bankid}
                      onChange={(e) => setData('bankid', e.target.value)}
                      className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all"
                      required
                      placeholder="Enter Bank ID"
                    />
                  </div>

                  <div>
                    <label htmlFor="accno" className="flex items-center text-sm font-medium text-gray-600 mb-1">
                      <Banknote size={20} className="mr-2 text-blue-500" />
                      Account Number
                    </label>
                    <input
                      id="accno"
                      type="text"
                      value={data.accno}
                      onChange={(e) => setData('accno', e.target.value)}
                      className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all"
                      required
                      placeholder="Enter Account Number"
                    />
                  </div>

                  <div>
                    <label htmlFor="ifsccode" className="flex items-center text-sm font-medium text-gray-600 mb-1">
                      <Key size={20} className="mr-2 text-purple-500" />
                      IFSC Code
                    </label>
                    <input
                      id="ifsccode"
                      type="text"
                      value={data.ifsccode}
                      onChange={(e) => setData('ifsccode', e.target.value)}
                      className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all"
                      required
                      placeholder="Enter IFSC Code"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={processing}
                    className="w-full bg-gray-800 text-white py-3 px-4 rounded-lg hover:bg-black focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                  >
                    {processing ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Submitting...
                      </span>
                    ) : "Register Beneficiary"}
                  </button>
                </form>

                {/* Response and error handling */}
                <div className="mt-6">
                  {error && (
                    <div className="p-4 bg-red-50 border border-red-100 rounded-lg">
                      <p className="text-red-600 text-sm flex items-center">
                        <AlertCircle size={16} className="mr-2" />
                        {error}
                      </p>
                    </div>
                  )}

                  {responseData && responseData.status === "SUCCESS" && (
                    <div className="p-4 bg-green-50 border border-green-100 rounded-lg">
                      <p className="text-green-600 text-sm flex items-center">
                        <CheckCircle size={16} className="mr-2" />
                        {responseData.message || 'Beneficiary successfully registered!'}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'list' && (
              <div>
                <h3 className="text-xl font-semibold text-gray-700 mb-4">Registered Beneficiaries</h3>
                {beneficiaries.length === 0 ? (
                  <p className="text-gray-500 text-sm">No beneficiaries registered yet.</p>
                ) : (
                  <div className="border border-gray-200 rounded-lg shadow-md overflow-hidden">
                    <Table className="w-full border-collapse">
                      <TableHeader className="bg-sky-500 text-white">
                        <TableRow>
                          <TableHead className="px-4 py-2 text-left">Bene ID</TableHead>
                          <TableHead className="px-4 py-2 text-left">Name</TableHead>
                          <TableHead className="px-4 py-2 text-left">Bank</TableHead>
                          <TableHead className="px-4 py-2 text-left">Acc No</TableHead>
                          <TableHead className="px-4 py-2 text-left">IFSC</TableHead>
                          <TableHead className="px-4 py-2 text-left">Verified</TableHead>
                          <TableHead className="px-4 py-2 text-left">Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {beneficiaries.map((item) => (
                          <TableRow key={item.id} className="border-b border-gray-200">
                            <TableCell className="px-4 py-2">{item.bene_id}</TableCell>
                            <TableCell className="px-4 py-2">{item.name}</TableCell>
                            <TableCell className="px-4 py-2">{item.bankname}</TableCell>
                            <TableCell className="px-4 py-2">{item.accno}</TableCell>
                            <TableCell className="px-4 py-2">{item.ifsc}</TableCell>
                            <TableCell className="px-4 py-2">{item.verified ? 'Yes' : 'No'}</TableCell>
                            <TableCell className="px-4 py-2">{item.status === '1' ? 'Active' : 'Inactive'}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default RegisterBeneficiary;