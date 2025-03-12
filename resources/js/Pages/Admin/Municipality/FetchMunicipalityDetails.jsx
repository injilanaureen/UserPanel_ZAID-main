import React, { useEffect, useState } from 'react';
import AdminLayout from "@/Layouts/AdminLayout";
import axios from 'axios';

const FetchMunicipalityDetails = () => {
  const [loading, setLoading] = useState(false);
  const [billDetails, setBillDetails] = useState(null);
  const [error, setError] = useState(null);
  const [municipalities, setMunicipalities] = useState([]); // Store municipalities
  const [formData, setFormData] = useState({
    canumber: '',
    operator: ''
  });

  // Fetch Municipality Operators when component mounts
  useEffect(() => {
    const fetchMunicipalities = async () => {
      try {
        const response = await axios.post(route("municipality.fetch"), { mode: 'online' });
        if (response.data && response.data.data) {
          setMunicipalities(response.data.data);
        } else {
          console.error("Unexpected API response format:", response.data);
        }
      } catch (err) {
        console.error("Error fetching municipalities:", err);
      }
    };
    
    fetchMunicipalities();
  }, []);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setBillDetails(null);
    console.log("User input data:", formData);

    try {
      // Step 1: Fetch the bill details
      const response = await axios.post('/api/municipality/fetch-bill', formData);
      const billData = response.data;
      console.log("Bill data from fetch:", billData);

      // Display the bill details in the UI
      setBillDetails(billData);

      // Step 2: Prepare the data for saving
      const saveData = {
        ca_number: formData.canumber,
        operator_id: formData.operator,
        name: billData.name || 'Unknown',
        amount: parseInt(billData.amount, 10) || 0,
        response_code: parseInt(billData.response_code || billData.responseCode, 10) || 0,
        status: typeof billData.status === 'boolean' ? billData.status : (billData.status === 'success' || billData.status === 'true'),
        message: billData.message || 'No message provided'
      };

      // Step 3: Save the bill data to the database
      try {
        await axios.post('/municipality/save-bill', saveData);
        console.log('Bill data saved successfully');
      } catch (saveError) {
        console.error('Error saving bill data:', saveError);
        console.log('Error details:', saveError.response?.data);
        setError(saveError.response?.data?.message || 'Failed to save bill details');
      }
    } catch (err) {
      console.error('Error fetching bill details:', err);
      setError(err.response?.data?.message || 'Failed to fetch bill details');
    } finally {
      setLoading(false);
    }
  };

  // Function to get municipality name by ID
  const getMunicipalityNameById = (id) => {
    const municipality = municipalities.find(muni => muni.id.toString() === id.toString());
    return municipality ? municipality.name : 'Unknown Municipality';
  };

  return (
    <AdminLayout>
      <div className="p-6 bg-gray-50">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-blue-700 border-b pb-4">Fetch Municipality Details</h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="canumber" className="block text-sm font-medium text-gray-700">CA Number</label>
              <input
                id="canumber"
                type="text"
                name="canumber"
                placeholder="Enter CA Number"
                value={formData.canumber}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="operator" className="block text-sm font-medium text-gray-700">Operator</label>
              <select
                id="operator"
                name="operator"
                value={formData.operator}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              >
                <option value="">Select Operator</option>
                {municipalities.length > 0 ? (
                  municipalities.map((municipality) => (
                    <option key={municipality.id} value={municipality.id}>
                      {municipality.name}
                    </option>
                  ))
                ) : (
                  <option disabled>Loading municipalities...</option>
                )}
              </select>
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed transition-colors duration-200 font-medium mt-4 shadow-md"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Fetching...
                </span>
              ) : 'Fetch Details'}
            </button>
          </form>
          
          {error && (
            <div className="mt-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-md">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium">{error}</p>
                </div>
              </div>
            </div>
          )}
          
          {billDetails && (
            <div className="mt-8 bg-gray-50 rounded-lg p-6 border border-gray-200">
              <h3 className="text-xl font-semibold mb-6 text-gray-800 flex items-center">
                <svg className="h-6 w-6 text-blue-600 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Bill Details
              </h3>
              
              <div className="mb-6 bg-blue-50 p-4 rounded-md border border-blue-100">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-blue-800">
                      Operator: <span className="font-bold">{getMunicipalityNameById(formData.operator)}</span>
                    </p>
                    <p className="text-sm text-blue-700">
                      CA Number: <span className="font-mono">{formData.canumber}</span>
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="overflow-hidden shadow-sm border border-gray-200 sm:rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-100">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Field
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Value
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {Object.entries(billDetails).map(([key, value], index) => (
                      <tr key={key} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-700">
                          {key.replace(/_/g, ' ').toUpperCase()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {typeof value === 'boolean' ? (
                            value ? (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                <svg className="-ml-0.5 mr-1.5 h-3 w-3 text-green-500" fill="currentColor" viewBox="0 0 12 12">
                                  <path d="M4 8l2 2 4-4m.535-2.857a7 7 0 11-9.9 9.9 7 7 0 019.9-9.9z" />
                                </svg>
                                Yes
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                <svg className="-ml-0.5 mr-1.5 h-3 w-3 text-red-500" fill="currentColor" viewBox="0 0 12 12">
                                  <path d="M10 2.5L7.5 5 10 7.5 7.5 10 5 7.5 2.5 10 0 7.5 2.5 5 0 2.5 2.5 0 5 2.5 7.5 0 10 2.5z" />
                                </svg>
                                No
                              </span>
                            )
                          ) : (
                            value !== null && value !== undefined ? value.toString() : "—"
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default FetchMunicipalityDetails;