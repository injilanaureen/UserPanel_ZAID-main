import React, { useState, useEffect } from "react";
import AdminLayout from '@/Layouts/AdminLayout';
import { useForm } from '@inertiajs/react';
import axios from "axios";
import { Signal, Phone, AlertCircle, CheckCircle, Code } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const FetchLPGDetails = ({ lpgData }) => {
  const [operators, setOperators] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedOperator, setSelectedOperator] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const { data, setData, post, processing } = useForm({
    operator: "",
    canumber: "",
    ad1: "",
    ad2: "",
    ad3: "",
  });

  useEffect(() => {
    fetchOperators();
  }, []);

  const fetchOperators = async () => {
    setLoading(true);
    try {
      const response = await axios.post("/api/fetch-lpg-operator", { mode: "offline" });
      setOperators(response.data.data || []);
    } catch (err) {
      console.error("Error fetching operators:", err);
      setError("Failed to fetch operators");
    }
    setLoading(false);
  };

  const handleChange = (name, value) => {
    setData(name, value);
    setError("");
    setSuccess("");
    
    if (name === "operator") {
      const operator = operators.find(op => op.id === value);
      setSelectedOperator(operator);
      if (operator) {
        setData(data => ({
          ...data,
          operator: value,
          ad1: "",
          ad2: "",
          ad3: "",
        }));
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("User Input data:",data);
    setLoading(true);
    setError("");
    setSuccess("");

    post(route('LPG.FetchLPGDetails'), {
      onSuccess: () => {
        setSuccess("LPG details fetched successfully!");
      },
      onError: (errors) => {
        setError(errors.message || "Failed to fetch LPG details");
      },
      onFinish: () => setLoading(false)
    });
  };

  return (
    <AdminLayout>
      <div className="max-w-full">
        <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
          <div className="bg-gradient-to-tr from-gray-400 to-black py-4 px-6">
            <h2 className="text-3xl font-semibold text-white">Fetch LPG Bill Details</h2>
          </div>

          <form onSubmit={handleSubmit} className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label htmlFor="operator" className="flex items-center text-sm font-medium text-gray-600 mb-1">
                  <Signal size={20} className="mr-2 text-green-500" />
                  Operator
                </label>
                <select
                  id="operator"
                  value={data.operator}
                  onChange={(e) => handleChange("operator", e.target.value)}
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all"
                  required
                >
                  <option value="">Select Operator</option>
                  {operators.map((operator) => (
                    <option key={operator.id} value={operator.id}>
                      {operator.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="canumber" className="flex items-center text-sm font-medium text-gray-600 mb-1">
                  <Phone size={20} className="mr-2 text-yellow-500" />
                  CA Number
                </label>
                <input
                  id="canumber"
                  type="text"
                  value={data.canumber}
                  onChange={(e) => handleChange("canumber", e.target.value)}
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all"
                  required
                  placeholder={selectedOperator?.displayname || "Enter CA Number"}
                />
                {selectedOperator?.regex && (
                  <p className="text-xs text-gray-500 mt-1">Format: {selectedOperator.regex}</p>
                )}
              </div>

              {selectedOperator?.ad1_d_name && (
                <div>
                  <label htmlFor="ad1" className="flex items-center text-sm font-medium text-gray-600 mb-1">
                    <Phone size={20} className="mr-2 text-blue-500" />
                    {selectedOperator.ad1_d_name}
                  </label>
                  <input
                    id="ad1"
                    type="text"
                    value={data.ad1}
                    onChange={(e) => handleChange("ad1", e.target.value)}
                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all"
                    required
                    placeholder={`Enter ${selectedOperator.ad1_d_name}`}
                  />
                  {selectedOperator?.ad1_regex && (
                    <p className="text-xs text-gray-500 mt-1">Format: {selectedOperator.ad1_regex}</p>
                  )}
                </div>
              )}

              {selectedOperator?.ad2_d_name && (
                <div>
                  <label htmlFor="ad2" className="flex items-center text-sm font-medium text-gray-600 mb-1">
                    <Phone size={20} className="mr-2 text-blue-500" />
                    {selectedOperator.ad2_d_name}
                  </label>
                  <input
                    id="ad2"
                    type="text"
                    value={data.ad2}
                    onChange={(e) => handleChange("ad2", e.target.value)}
                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all"
                    required={!!selectedOperator?.ad2_d_name}
                    placeholder={`Enter ${selectedOperator.ad2_d_name}`}
                  />
                  {selectedOperator?.ad2_regex && (
                    <p className="text-xs text-gray-500 mt-1">Format: {selectedOperator.ad2_regex}</p>
                  )}
                </div>
              )}

              {selectedOperator?.ad3_d_name && (
                <div>
                  <label htmlFor="ad3" className="flex items-center text-sm font-medium text-gray-600 mb-1">
                    <Phone size={20} className="mr-2 text-blue-500" />
                    {selectedOperator.ad3_d_name}
                  </label>
                  <input
                    id="ad3"
                    type="text"
                    value={data.ad3}
                    onChange={(e) => handleChange("ad3", e.target.value)}
                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all"
                    required={!!selectedOperator?.ad3_d_name}
                    placeholder={`Enter ${selectedOperator.ad3_d_name}`}
                  />
                  {selectedOperator?.ad3_regex && (
                    <p className="text-xs text-gray-500 mt-1">Format: {selectedOperator.ad3_regex}</p>
                  )}
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={loading || processing}
              className="w-full bg-gray-800 text-white py-3 px-4 rounded-lg hover:bg-black focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
            >
              {loading || processing ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Fetching...
                </span>
              ) : "Fetch Details"}
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

            {lpgData && (
              <div className="mt-4">
                <h3 className="font-medium text-sm text-gray-700 mb-2 flex items-center">
                  <Code size={16} className="mr-2" />
                  Bill Details:
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
                      {Object.entries(lpgData).map(([key, value]) => (
                        <TableRow key={key} className="border-b border-gray-200">
                          <TableCell className="px-4 py-2 font-medium">{key}</TableCell>
                          <TableCell className="px-4 py-2">
                            {typeof value === 'boolean' ? (value ? "Success ✅" : "Failed ❌") : String(value)}
                          </TableCell>
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

export default FetchLPGDetails;