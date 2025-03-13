import React, { useState } from 'react';
import { useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Phone, Banknote, User, MapPin, Home, Calendar, Code, AlertCircle, CheckCircle } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const PennyDrop = ({ apiResponse }) => {
  const { data, setData, post, processing, errors } = useForm({
    mobile: '',
    accno: '',
    bankid: '',
    benename: '',
    pincode: '',
    address: '',
    dob: '',
    gst_state: '',
    bene_id: '',
  });

  const [responseData, setResponseData] = useState(apiResponse || null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleDateChange = (e) => {
    const dateValue = e.target.value;
    if (dateValue) {
      const [year, month, day] = dateValue.split('-');
      setData('dob', `${day}-${month}-${year}`);
    } else {
      setData('dob', '');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    post(route('transaction2.pennyDrop'), {
      onSuccess: (response) => {
        setResponseData(response.props.apiResponse);
        setSuccess('Penny Drop processed successfully!');
      },
      onError: (err) => {
        setError(err.message || 'Failed to process Penny Drop');
      },
    });
  };

  const getDateInputValue = () => {
    if (!data.dob) return '';
    const parts = data.dob.split('-');
    return parts.length === 3 && parts[0].length === 2 ? `${parts[2]}-${parts[1]}-${parts[0]}` : data.dob;
  };

  return (
    <AdminLayout>
      <div className="max-w-full">
        <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
          <div className="bg-gradient-to-tr from-gray-400 to-black py-4 px-6">
            <h2 className="text-3xl font-semibold text-white">Penny Drop Verification</h2>
          </div>

          <form onSubmit={handleSubmit} className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {[
                { name: 'mobile', label: 'Mobile Number', icon: Phone, iconColor: 'text-yellow-500' },
                { name: 'accno', label: 'Account Number', icon: Banknote, iconColor: 'text-blue-500' },
                { name: 'bankid', label: 'Bank ID', icon: Code, iconColor: 'text-green-500', type: 'number' },
                { name: 'benename', label: 'Beneficiary Name', icon: User, iconColor: 'text-purple-500' },
                { name: 'pincode', label: 'Pincode', icon: MapPin, iconColor: 'text-red-500' },
                { name: 'address', label: 'Address', icon: Home, iconColor: 'text-indigo-500' },
                { name: 'gst_state', label: 'GST State Code', icon: Code, iconColor: 'text-teal-500' },
                { name: 'bene_id', label: 'Beneficiary ID', icon: User, iconColor: 'text-orange-500', type: 'number' },
              ].map((field) => (
                <div key={field.name}>
                  <label htmlFor={field.name} className="flex items-center text-sm font-medium text-gray-600 mb-1">
                    <field.icon size={20} className={`mr-2 ${field.iconColor}`} />
                    {field.label}
                  </label>
                  <input
                    id={field.name}
                    type={field.type || 'text'}
                    value={data[field.name]}
                    onChange={(e) => setData(field.name, e.target.value)}
                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all"
                    required
                    placeholder={`Enter ${field.label}`}
                  />
                  {errors[field.name] && (
                    <p className="text-red-500 text-sm mt-1">{errors[field.name]}</p>
                  )}
                </div>
              ))}

              <div>
                <label htmlFor="dob" className="flex items-center text-sm font-medium text-gray-600 mb-1">
                  <Calendar size={20} className="mr-2 text-blue-500" />
                  Date of Birth
                </label>
                <input
                  id="dob"
                  type="date"
                  value={getDateInputValue()}
                  onChange={handleDateChange}
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all"
                  required
                />
              </div>
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
                  Processing...
                </span>
              ) : "Verify Penny Drop"}
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

            {success && (
              <div className="mt-4 p-4 bg-green-50 border border-green-100 rounded-lg">
                <p className="text-green-600 text-sm flex items-center">
                  <CheckCircle size={16} className="mr-2" />
                  {success}
                </p>
              </div>
            )}

            {responseData && (
              <div className="mt-4">
                <h3 className="font-medium text-sm text-gray-700 mb-2 flex items-center">
                  <Code size={16} className="mr-2" />
                  API Response:
                </h3>
                <div className="border border-gray-200 rounded-lg shadow-md overflow-hidden">
                  <Table className="w-full border-collapse">
                    <TableHeader className="bg-sky-500 text-white">
                      <TableRow>
                        <TableHead className="px-4 py-2 text-left">Key</TableHead>
                        <TableHead className="px-4 py-2 text-left">Value</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {Object.entries(responseData).map(([key, value]) => (
                        <TableRow key={key} className="border-b border-gray-200">
                          <TableCell className="px-4 py-2 font-medium">{key}</TableCell>
                          <TableCell className="px-4 py-2">{String(value) || 'N/A'}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default PennyDrop;