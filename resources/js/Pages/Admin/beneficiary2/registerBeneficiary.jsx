import { useForm } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';

const RegisterBeneficiary = ({ beneficiaries = [], success, response, error: serverError }) => {
  const { data, setData, post, processing, reset } = useForm({
    mobile: '',
    benename: '',
    bankid: '',
    accno: '',
    ifsccode: '',
    verified: '0',
  });

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
    post('/beneficiary/register', {
      onSuccess: (page) => {
        if (page.props.success) {
          setResponseData(page.props.response);
          setError(null);
          reset();
        } else {
          setError(page.props.error || 'Failed to register beneficiary.');
        }
      },
      onError: (errors) => {
        // Handle validation errors
        setError('Validation failed: ' + Object.values(errors).join(', '));
      },
    });
  };

  return (
    <AdminLayout>
      <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">

        {/* Form Section */}
        <div className="bg-white p-6 shadow-lg rounded-lg">
          <h2 className="text-2xl font-bold mb-6">Register Beneficiary</h2>

          {responseData && responseData.status === "SUCCESS" && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
              <p>{responseData.message || 'Beneficiary successfully registered!'}</p>
            </div>
          )}
          
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              <p>{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {['mobile', 'benename', 'bankid', 'accno', 'ifsccode'].map((field, index) => (
              <div key={index}>
                <label className="block font-semibold capitalize">
                  {field === 'benename' ? 'Beneficiary Name' : 
                    field === 'accno' ? 'Account Number' :
                    field === 'ifsccode' ? 'IFSC Code' :
                    field === 'bankid' ? 'Bank ID' : 'Mobile'}:
                </label>
                <input
                  type="text"
                  value={data[field]}
                  onChange={(e) => setData(field, e.target.value)}
                  className="border rounded-lg p-3 w-full mt-1"
                  required
                />
              </div>
            ))}

            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 w-full"
              disabled={processing}
            >
              {processing ? 'Submitting...' : 'Submit'}
            </button>
          </form>
        </div>

        {/* Beneficiaries Table */}
        <div className="bg-gray-100 p-6 shadow-lg rounded-lg">
          <h3 className="text-xl font-semibold mb-6">Registered Beneficiaries</h3>

          {beneficiaries.length === 0 ? (
            <p className="text-gray-500">No beneficiaries registered yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-blue-500 text-white">
                    <th className="p-3">Beneficiary ID</th>
                    <th className="p-3">Name</th>
                    <th className="p-3">Bank Name</th>
                    <th className="p-3">Account No</th>
                    <th className="p-3">IFSC</th>
                    <th className="p-3">Verified</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Message</th>
                  </tr>
                </thead>
                <tbody>
                  {beneficiaries.map((item) => (
                    <tr key={item.id} className="text-center border-t">
                      <td className="p-3">{item.bene_id}</td>
                      <td className="p-3">{item.name}</td>
                      <td className="p-3">{item.bankname}</td>
                      <td className="p-3">{item.accno}</td>
                      <td className="p-3">{item.ifsc}</td>
                      <td className="p-3">{item.verified ? 'Yes' : 'No'}</td>
                      <td className="p-3">{item.status === '1' ? 'Active' : 'Inactive'}</td>
                      <td className="p-3">{item.message || 'N/A'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default RegisterBeneficiary;