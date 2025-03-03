import { useForm } from '@inertiajs/react';
import { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';

const RegisterBeneficiary = ({ beneficiaries = [] }) => {
  const { data, setData, post, processing, reset } = useForm({
    mobile: '',
    benename: '',
    bankid: '',
    accno: '',
    ifsccode: '',
    verified: '0',
  });

  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    post('/beneficiary/register', {
      onSuccess: (page) => {
        setResponse(page.props.response);
        setError(null);
        reset();
      },
      onError: () => setError('Failed to register beneficiary.'),
    });
  };

  return (
    <AdminLayout>
      <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">

        {/* Form Section */}
        <div className="bg-white p-6 shadow-lg rounded-lg">
          <h2 className="text-2xl font-bold mb-6">Register Beneficiary</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {['mobile', 'benename', 'bankid', 'accno', 'ifsccode'].map((field, index) => (
              <div key={index}>
                <label className="block font-semibold capitalize">
                  {field.replace('benename', 'Beneficiary Name')}:
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

            {error && <p className="text-red-500 mt-4">{error}</p>}
          </form>
        </div>

        {/* Beneficiaries Table */}
        <div className="bg-gray-100 p-6 shadow-lg rounded-lg">
          <h3 className="text-xl font-semibold mb-6">Registered Beneficiaries</h3>

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
        </div>

      </div>
    </AdminLayout>
  );
};

export default RegisterBeneficiary;
