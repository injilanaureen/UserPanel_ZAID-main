import React, { useState, useEffect } from "react";
import { Cable, FileText, Download, Printer } from "lucide-react";
import axios from "axios";
import AdminLayout from '@/Layouts/AdminLayout';
const Alert = ({ children, variant }) => {
  const bgColor = variant === "destructive" ? "bg-red-50 border-red-200 text-red-700" : "bg-green-50 border-green-200 text-green-700";
  return (
    
    <div className={`p-4 rounded-lg border ${bgColor}`}>
      {children}
    </div>
  );
};

const Operators = () => {
  const [showTable, setShowTable] = useState(true);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isSynced, setIsSynced] = useState(false);
  const [formData, setFormData] = useState({
    operatorName: '',
    serviceTypeName: '',
    date: ''
  });
  const [filters, setFilters] = useState({
    filterText: "",
    serviceType: "",
  });

  const serviceTypeOptions = ["Prepaid", "DTH"];

  useEffect(() => {
    fetchOperators();
  }, []);

  const fetchOperators = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/recharge/operators/list');
      
      if (response.data.status === 'success') {
        setData(response.data.data);
        // Check if data exists to determine sync status
        setIsSynced(response.data.data.length > 0);
      } else {
        setError('Failed to fetch operators');
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch operators');
      console.error('API Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchExternalOperators = async () => {
    if (isSynced) {
      setError('Operators have already been synced. Duplicate sync is not allowed.');
      return;
    }

    try {
      setLoading(true);
      const apiUrl = 'https://sit.paysprint.in/service-api/api/v1/service/recharge/recharge/getoperator';
      const headers = {
        'Authorisedkey': 'Y2RkZTc2ZmNjODgxODljMjkyN2ViOTlhM2FiZmYyM2I=',
        'Token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0aW1lc3RhbXAiOjE3Mzg5MjE3NzcsInBhcnRuZXJJZCI6IlBTMDAxNTY4IiwicmVxaWQiOiIxNzM4OTIxNzc3In0.6vhPb1SE1p3yvAaK_GAEz-Y0Ai1ibCbN85adKW_1Xzg',
        'Accept': 'application/json',
      };

      const response = await axios.post(apiUrl, {}, { headers });

      if (response.data.status) {
        const existingOperators = await axios.get('/recharge/operators/list');
        const existingOperatorNames = new Set(
          existingOperators.data.data.map(op => op.operator_name)
        );

        const transformedData = response.data.data
          .filter(operator => !existingOperatorNames.has(operator.name))
          .map(operator => ({
            operator_name: operator.name,
            service_name: operator.category,
            date: new Date().toISOString().split('T')[0]
          }));

        for (const operatorData of transformedData) {
          await axios.post('/recharge/operators', operatorData);
        }

        setIsSynced(true);
        setSuccess(`Synced ${transformedData.length} new operators`);
        
        await fetchOperators();
      }
    } catch (err) {
      console.error('External API fetch error:', err);
      setError('Failed to sync operators');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError(null);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    const errors = [];
    if (!formData.operatorName) errors.push("Operator Name is required");
    if (!formData.serviceTypeName) errors.push("Service Type is required");
    if (!formData.date) errors.push("Date is required");
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();

    if (validationErrors.length > 0) {
      setError(validationErrors.join('\n'));
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const formattedData = {
        operator_name: formData.operatorName,
        service_name: formData.serviceTypeName,
        date: formData.date
      };

      const response = await axios.post('/recharge/operators', formattedData);
      
      if (response.data.status === 'success') {
        setSuccess('Operator created successfully');
        setFormData({
          operatorName: '',
          serviceTypeName: '',
          date: ''
        });
        await fetchOperators();
        setShowTable(true);
      }
    } catch (err) {
      console.error('Error details:', err.response?.data);
      setError(err.response?.data?.message || 'An error occurred while creating the operator');
    } finally {
      setLoading(false);
    }
  };

  const handleFilter = () => {
    const filtered = data.filter(item => {
      const matchesText = filters.filterText.toLowerCase() === '' ||
        item.operator_name.toLowerCase().includes(filters.filterText.toLowerCase());

      const matchesService = filters.serviceType === '' ||
        item.service_name === filters.serviceType;

      return matchesText && matchesService;
    });

    setData(filtered);
  };

  const handleExport = (type) => {
    console.log(`Exporting as ${type}`);
  };

  return (
    <AdminLayout>
    <div className="bg-white p-4">
      <div className="text-xl sm:text-2xl font-semibold mb-4 flex items-center space-x-2">
        <Cable className="text-blue-600 w-6 h-6" />
        <span>Recharge System</span>
        <button 
          onClick={fetchExternalOperators}
          disabled={isSynced}
          className={`ml-4 px-3 py-1 rounded ${
            isSynced 
              ? 'bg-gray-400 text-gray-600 cursor-not-allowed' 
              : 'bg-green-500 text-white hover:bg-green-600'
          }`}
        >
          {isSynced ? 'Synced' : 'Sync External Operators'}
        </button>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-4">
          {error.split('\n').map((err, index) => (
            <div key={index}>{err}</div>
          ))}
        </Alert>
      )}

      {success && (
        <Alert className="mb-4">
          {success}
        </Alert>
      )}

      <div className="flex items-start sm:w-1/4 w-full mb-6 rounded-lg">
        <button
          onClick={() => setShowTable(true)}
          className={`px-4 py-2 border-l-2 border-cyan-600 font-medium w-full sm:w-auto ${
            showTable
              ? "bg-cyan-600 text-white shadow-lg ring-2 ring-cyan-500"
              : "bg-gray-100 text-black hover:bg-cyan-600 hover:text-white"
          } hover:opacity-90 transition duration-300`}
        >
          List Operator
        </button>
        <button
          onClick={() => setShowTable(false)}
          className={`px-4 py-2 border-r-2 border-cyan-600 font-medium w-full sm:w-auto ${
            !showTable
              ? "bg-cyan-600 text-white shadow-lg ring-2 ring-cyan-500"
              : "bg-gray-100 text-black hover:bg-cyan-600 hover:text-white"
          } hover:opacity-90 transition duration-300`}
        >
          Add Operator
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 bg-white p-6 rounded-lg mb-4 shadow">
        <div>
          <label className="block text-gray-700 font-medium mb-1">Service Category Type</label>
          <select
            name="serviceType"
            value={filters.serviceType}
            onChange={handleFilterChange}
            className="w-full border border-gray-300 p-2 rounded"
          >
            <option value="">- Select Service Type Name -</option>
            {serviceTypeOptions.map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-1">Search Text</label>
          <input
            type="text"
            name="filterText"
            className="w-full border border-gray-300 p-2 rounded"
            placeholder="Search Text"
            value={filters.filterText}
            onChange={handleFilterChange}
          />
        </div>
        <div className="col-span-1 sm:col-span-2 md:col-span-1 flex items-end">
          <button
            onClick={handleFilter}
            className="bg-cyan-600 text-white px-4 py-2 rounded hover:bg-cyan-700"
            disabled={loading}
          >
            Apply Filters
          </button>
        </div>
      </div>

      <div className="p-4 flex flex-col md:flex-row justify-between items-center border-b">
        <div className="flex items-center space-x-4">
          <span>Total Record(s): {data.length}</span>
          <button onClick={() => handleExport("excel")} className="text-green-600">
            <FileText className="w-6 h-6" />
          </button>
          <button onClick={() => handleExport("word")} className="text-blue-600">
            <Download className="w-6 h-6" />
          </button>
          <button onClick={() => handleExport("pdf")} className="text-red-600">
            <Printer className="w-6 h-6" />
          </button>
        </div>
      </div>

      {showTable ? (
        <div className="overflow-x-auto">
          <table className="w-full border text-xs sm:text-sm">
            <thead>
              <tr className="bg-gray-50">
                <th className="p-3 text-left">S. No</th>
                <th className="p-3 text-left">Operator Name</th>
                <th className="p-3 text-left">Service Name</th>
                <th className="p-3 text-left">Date</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="4" className="p-3 text-center">Loading...</td>
                </tr>
              ) : data.length > 0 ? (
                data.map((row, index) => (
                  <tr key={index} className="border-t hover:bg-gray-50">
                    <td className="p-3">{index + 1}</td>
                    <td className="p-3">{row.operator_name}</td>
                    <td className="p-3">{row.service_name}</td>
                    <td className="p-3">{row.date}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="p-3 text-center">No data found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-lg">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 font-medium mb-1">Operator Name *</label>
              <input
                type="text"
                name="operatorName"
                value={formData.operatorName}
                onChange={handleChange}
                className="w-full border border-gray-300 p-2 rounded"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-1">Service Type *</label>
              <select
                name="serviceTypeName"
                value={formData.serviceTypeName}
                onChange={handleChange}
                className="w-full border border-gray-300 p-2 rounded"
                required
              >
                <option value="">Select Service Type</option>
                {serviceTypeOptions.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-1">Date *</label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="w-full border border-gray-300 p-2 rounded"
                required
              />
            </div>
          </div>
          <div className="flex justify-end mt-4">
            <button
              type="submit"
              className="bg-cyan-600 text-white px-6 py-2 rounded hover:bg-cyan-700"
              disabled={loading}
            >
              {loading ? 'Submitting...' : 'Submit'}
            </button>
          </div>
        </form>
      )}
    </div>
    </AdminLayout>
  );
};

export default Operators;