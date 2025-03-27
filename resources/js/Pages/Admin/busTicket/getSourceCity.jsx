import React, { useState, useEffect } from "react";
import { Loader2, Search } from "lucide-react";
import AdminLayout from '@/Layouts/AdminLayout';

const CityList = () => {
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedState, setSelectedState] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [states, setStates] = useState([]);

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const response = await fetch('/admin/busTicket/fetchSourceCities', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
          }
        });
        
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
    
        const data = await response.json();
        
        if (data.status && data.data.cities) {
          setCities(data.data.cities);
          const uniqueStates = [...new Set(data.data.cities.map(city => city.state))];
          setStates(uniqueStates);
        } else {
          throw new Error('Failed to fetch cities data');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCities();
  }, []);

  const filteredCities = cities.filter(city => {
    const matchesSearch = 
      (city.name?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
      (city.state?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
      (city.id?.toString().includes(searchTerm) || false);
    const matchesState = selectedState === "all" || city.state === selectedState;
    return matchesSearch && matchesState;
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentCities = filteredCities.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredCities.length / itemsPerPage);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <AdminLayout>
      <div className="relative">
        {/* Loading Overlay */}
        {loading && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg flex items-center flex-col gap-4">
              <Loader2 className="h-12 w-12 animate-spin text-blue-500" />
              <p className="text-gray-600">Loading cities data...</p>
            </div>
          </div>
        )}

        {/* Main Content with blur when loading */}
        <div className={`${loading ? 'blur-sm' : ''} transition-all duration-300`}>
          {error ? (
            <div className="text-red-500 p-4">
              Error: {error}
            </div>
          ) : (
            <>
              <div className="bg-gradient-to-tr from-gray-400 to-black py-4 px-6">
                <h2 className="text-3xl font-semibold text-white">Available Bus Source Cities</h2>
              </div>
              
              {/* Filters */}
              <div className="mb-6 mt-6 flex gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search cities, states, or IDs..."
                    className="pl-10 pr-4 py-2 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setCurrentPage(1);
                    }}
                  />
                </div>
                <select
                  className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={selectedState}
                  onChange={(e) => {
                    setSelectedState(e.target.value);
                    setCurrentPage(1);
                  }}
                >
                  <option value="all">All States</option>
                  {states.map((state) => (
                    <option key={state} value={state}>
                      {state}
                    </option>
                  ))}
                </select>
              </div>

              {/* Results count */}
              <div className="mb-4 text-sm text-gray-600">
                Showing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredCities.length)} of {filteredCities.length} cities
              </div>

              {/* Table */}
              <div className="overflow-x-auto rounded-lg border border-gray-200">
                <table className="min-w-full bg-white">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">City</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">State</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location Type</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Coordinates</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {currentCities.map((city, index) => (
                      <tr key={city.id || index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">{city.id}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{city.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{city.state}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{city.locationType}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {city.latitude}, {city.longitude}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-4 px-4">
                  <button
                    onClick={() => paginate(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-3 py-1 border rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  
                  <div className="flex gap-2">
                    {[...Array(totalPages)].map((_, index) => {
                      const pageNumber = index + 1;
                      if (
                        pageNumber === 1 ||
                        pageNumber === totalPages ||
                        (pageNumber >= currentPage - 2 && pageNumber <= currentPage + 2)
                      ) {
                        return (
                          <button
                            key={pageNumber}
                            onClick={() => paginate(pageNumber)}
                            className={`px-3 py-1 border rounded-md ${
                              currentPage === pageNumber
                                ? "bg-blue-500 text-white"
                                : "hover:bg-gray-100"
                            }`}
                          >
                            {pageNumber}
                          </button>
                        );
                      } else if (
                        pageNumber === currentPage - 3 ||
                        pageNumber === currentPage + 3
                      ) {
                        return <span key={pageNumber}>...</span>;
                      }
                      return null;
                    })}
                  </div>

                  <button
                    onClick={() => paginate(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 border rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default CityList;