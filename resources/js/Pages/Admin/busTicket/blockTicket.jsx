import React, { useState, useEffect } from 'react';
import { router } from '@inertiajs/react';
import axios from "axios";
import AdminLayout from '@/Layouts/AdminLayout';
import { Bus, MapPin, User, CreditCard, Ticket, AlertCircle, CheckCircle, Search } from 'lucide-react';

const BlockTicket = () => {
  const [formData, setFormData] = useState({
    availableTripId: '',
    boardingPointId: '',
    droppingPointId: '',
    source: '',
    destination: '',
    bookingType: 'ONLINE',
    serviceCharge: '',
    paymentMode: 'CASH',
    inventoryItems: [{
      seatName: '',
      fare: '',
      serviceTax: '',
      operatorServiceCharge: '',
      ladiesSeat: 'false',
      passenger: {
        name: '',
        mobile: '',
        title: 'Mr',
        email: '',
        age: '',
        gender: 'MALE',
        address: '',
        idType: '',
        idNumber: '',
        primary: '0',
      },
    }],
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [pointsLoading, setPointsLoading] = useState(false);
  const [boardingPoints, setBoardingPoints] = useState([]);
  const [droppingPoints, setDroppingPoints] = useState([]);
  const [selectedBoardingAddress, setSelectedBoardingAddress] = useState('');
  const [selectedDroppingAddress, setSelectedDroppingAddress] = useState('');
  const [success, setSuccess] = useState('');
  const [sourceCities, setSourceCities] = useState([]);
  const [destinationCities, setDestinationCities] = useState([]);
  const [sourceSearch, setSourceSearch] = useState('');
  const [destSearch, setDestSearch] = useState('');
  const [showSourceDropdown, setShowSourceDropdown] = useState(false);
  const [showDestDropdown, setShowDestDropdown] = useState(false);

  useEffect(() => {
    if (formData.availableTripId) {
      fetchTripDetails();
    }
  }, [formData.availableTripId]);

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const response = await fetch('/admin/busTicket/fetchSourceCities', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
          },
        });

        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        if (data.status && data.data.cities) {
          setSourceCities(data.data.cities);
          setDestinationCities(data.data.cities);
        } else {
          throw new Error('Failed to fetch cities data');
        }
      } catch (err) {
        setErrors({ cities: err.message });
      }
    };
    fetchCities();
  }, []);

  const fetchTripDetails = async () => {
    setPointsLoading(true);
    try {
      const response = await axios.post('/admin/busTicket/fetchTripDetails', {
        trip_id: formData.availableTripId,
      }, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });

      const data = response.data;
      if (data.status && data.data) {
        setBoardingPoints(data.data.boardingTimes || []);
        setDroppingPoints(data.data.droppingTimes || []);
      }
    } catch (err) {
      console.error('Error fetching trip details:', err);
      setErrors({ tripDetails: 'Failed to load boarding/dropping points' });
    } finally {
      setPointsLoading(false);
    }
  };

  const handleChange = (e, index = 0) => {
    const { name, value } = e.target;
    setErrors({});
    setSuccess('');

    if (name.includes('passenger.')) {
      const passengerField = name.split('passenger.')[1];
      setFormData((prev) => ({
        ...prev,
        inventoryItems: prev.inventoryItems.map((item, i) =>
          i === index ? { ...item, passenger: { ...item.passenger, [passengerField]: value } } : item
        ),
      }));
    } else if (name.includes('inventoryItems.')) {
      const field = name.split('.')[2];
      setFormData((prev) => ({
        ...prev,
        inventoryItems: prev.inventoryItems.map((item, i) =>
          i === index ? { ...item, [field]: value } : item
        ),
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleBoardingChange = (e) => {
    const selectedAddr = e.target.value;
    setSelectedBoardingAddress(selectedAddr);
    const selectedPoint = boardingPoints.find(point => point.address === selectedAddr);
    if (selectedPoint) {
      setFormData(prev => ({ ...prev, boardingPointId: selectedPoint.bpId }));
    }
  };

  const handleDroppingChange = (e) => {
    const selectedAddr = e.target.value;
    setSelectedDroppingAddress(selectedAddr);
    const selectedPoint = droppingPoints.find(point => point.address === selectedAddr);
    if (selectedPoint) {
      setFormData(prev => ({ ...prev, droppingPointId: selectedPoint.bpId }));
    }
  };

  const handleCitySelect = (type, city) => {
    if (type === "source") {
      setFormData((prev) => ({ ...prev, source: city.id }));
      setSourceSearch(city.name);
      setShowSourceDropdown(false);
    } else {
      setFormData((prev) => ({ ...prev, destination: city.id }));
      setDestSearch(city.name);
      setShowDestDropdown(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});
    setSuccess('');

    router.post('/admin/bus-ticket/block/api', formData, {
      onSuccess: () => {
        setLoading(false);
        setSuccess('Ticket blocked successfully!');
        setFormData({
          availableTripId: '',
          boardingPointId: '',
          droppingPointId: '',
          source: '',
          destination: '',
          bookingType: 'ONLINE',
          serviceCharge: '',
          paymentMode: 'CASH',
          inventoryItems: [{
            seatName: '',
            fare: '',
            serviceTax: '',
            operatorServiceCharge: '',
            ladiesSeat: 'false',
            passenger: {
              name: '',
              mobile: '',
              title: 'Mr',
              email: '',
              age: '',
              gender: 'MALE',
              address: '',
              idType: '',
              idNumber: '',
              primary: '0',
            },
          }],
        });
        setSourceSearch('');
        setDestSearch('');
      },
      onError: (err) => {
        setLoading(false);
        setErrors(err);
      },
    });
  };

  const filteredSourceCities = sourceCities.filter(city =>
    city.name.toLowerCase().includes(sourceSearch.toLowerCase())
  ).slice(0, 10);

  const filteredDestCities = destinationCities.filter(city =>
    city.name.toLowerCase().includes(destSearch.toLowerCase())
  ).slice(0, 10);

  return (
    <AdminLayout>
      <div className="max-w-full">
        <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
          <div className="bg-gradient-to-tr from-gray-400 to-black py-4 px-6">
            <h2 className="text-3xl font-semibold text-white">Block Bus Ticket</h2>
          </div>

          <form onSubmit={handleSubmit} className="p-6">
            {/* Trip Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="flex items-center text-sm font-medium text-gray-600 mb-1">
                  <Bus size={20} className="mr-2 text-green-500" />
                  Available Trip ID
                </label>
                <input
                  type="text"
                  name="availableTripId"
                  value={formData.availableTripId}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all"
                  required
                />
              </div>

              <div>
                <label className="flex items-center text-sm font-medium text-gray-600 mb-1">
                  <MapPin size={20} className="mr-2 text-yellow-500" />
                  Boarding Point
                </label>
                <select
                  value={selectedBoardingAddress}
                  onChange={handleBoardingChange}
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all"
                  disabled={!formData.availableTripId || pointsLoading}
                  required
                >
                  {pointsLoading ? (
                    <option value="">Loading boarding points...</option>
                  ) : (
                    <>
                      <option value="">Select boarding point</option>
                      {boardingPoints.map((point, index) => (
                        <option key={index} value={point.address}>
                          {point.address} (ID: {point.bpId})
                        </option>
                      ))}
                    </>
                  )}
                </select>
              </div>

              <div>
                <label className="flex items-center text-sm font-medium text-gray-600 mb-1">
                  <MapPin size={20} className="mr-2 text-red-500" />
                  Dropping Point
                </label>
                <select
                  value={selectedDroppingAddress}
                  onChange={handleDroppingChange}
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all"
                  disabled={!formData.availableTripId || pointsLoading}
                  required
                >
                  {pointsLoading ? (
                    <option value="">Loading dropping points...</option>
                  ) : (
                    <>
                      <option value="">Select dropping point</option>
                      {droppingPoints.map((point, index) => (
                        <option key={index} value={point.address}>
                          {point.address} (ID: {point.bpId})
                        </option>
                      ))}
                    </>
                  )}
                </select>
              </div>

              <div className="relative">
                <label className="flex items-center text-sm font-medium text-gray-600 mb-1">
                  <MapPin size={20} className="mr-2 text-blue-500" />
                  Source City
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    value={sourceSearch}
                    onChange={(e) => {
                      setSourceSearch(e.target.value);
                      setShowSourceDropdown(true);
                    }}
                    onFocus={() => setShowSourceDropdown(true)}
                    className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all"
                    placeholder="Search source city..."
                    required
                  />
                  {showSourceDropdown && filteredSourceCities.length > 0 && (
                    <ul className="absolute z-10 w-full bg-white border border-gray-200 rounded-lg mt-1 max-h-60 overflow-y-auto shadow-lg">
                      {filteredSourceCities.map((city) => (
                        <li
                          key={city.id}
                          onClick={() => handleCitySelect("source", city)}
                          className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                        >
                          {city.name}, {city.state} (ID: {city.id})
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>

              <div className="relative">
                <label className="flex items-center text-sm font-medium text-gray-600 mb-1">
                  <MapPin size={20} className="mr-2 text-purple-500" />
                  Destination City
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    value={destSearch}
                    onChange={(e) => {
                      setDestSearch(e.target.value);
                      setShowDestDropdown(true);
                    }}
                    onFocus={() => setShowDestDropdown(true)}
                    className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all"
                    placeholder="Search destination city..."
                    required
                  />
                  {showDestDropdown && filteredDestCities.length > 0 && (
                    <ul className="absolute z-10 w-full bg-white border border-gray-200 rounded-lg mt-1 max-h-60 overflow-y-auto shadow-lg">
                      {filteredDestCities.map((city) => (
                        <li
                          key={city.id}
                          onClick={() => handleCitySelect("destination", city)}
                          className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                        >
                          {city.name}, {city.state} (ID: {city.id})
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>

              <div>
                <label className="flex items-center text-sm font-medium text-gray-600 mb-1">
                  <Ticket size={20} className="mr-2 text-indigo-500" />
                  Booking Type
                </label>
                <select
                  name="bookingType"
                  value={formData.bookingType}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all"
                >
                  <option value="ONLINE">Online</option>
                  <option value="OFFLINE">Offline</option>
                  <option value="STANDARD">Standard</option>
                </select>
              </div>

              <div>
                <label className="flex items-center text-sm font-medium text-gray-600 mb-1">
                  <CreditCard size={20} className="mr-2 text-teal-500" />
                  Service Charge
                </label>
                <input
                  type="number"
                  name="serviceCharge"
                  value={formData.serviceCharge}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all"
                  min="0"
                />
              </div>

              <div>
                <label className="flex items-center text-sm font-medium text-gray-600 mb-1">
                  <CreditCard size={20} className="mr-2 text-orange-500" />
                  Payment Mode
                </label>
                <select
                  name="paymentMode"
                  value={formData.paymentMode}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all"
                >
                  <option value="CASH">Cash</option>
                  <option value="CARD">Card</option>
                  <option value="UPI">UPI</option>
                  <option value="NETBANKING">Netbanking</option>
                </select>
              </div>
            </div>

            {/* Passenger Details */}
            <div className="border border-gray-200 rounded-lg p-6 mb-6">
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <User size={20} className="mr-2 text-gray-600" />
                Passenger Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="flex items-center text-sm font-medium text-gray-600 mb-1">Seat Name</label>
                  <input
                    type="text"
                    name="inventoryItems.0.seatName"
                    value={formData.inventoryItems[0].seatName}
                    onChange={(e) => handleChange(e, 0)}
                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all"
                    required
                  />
                </div>
                <div>
                  <label className="flex items-center text-sm font-medium text-gray-600 mb-1">Fare</label>
                  <input
                    type="number"
                    name="inventoryItems.0.fare"
                    value={formData.inventoryItems[0].fare}
                    onChange={(e) => handleChange(e, 0)}
                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all"
                    required
                    min="0"
                  />
                </div>
                <div>
                  <label className="flex items-center text-sm font-medium text-gray-600 mb-1">Service Tax</label>
                  <input
                    type="number"
                    name="inventoryItems.0.serviceTax"
                    value={formData.inventoryItems[0].serviceTax}
                    onChange={(e) => handleChange(e, 0)}
                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all"
                    min="0"
                  />
                </div>
                <div>
                  <label className="flex items-center text-sm font-medium text-gray-600 mb-1">Operator Service Charge</label>
                  <input
                    type="number"
                    name="inventoryItems.0.operatorServiceCharge"
                    value={formData.inventoryItems[0].operatorServiceCharge}
                    onChange={(e) => handleChange(e, 0)}
                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all"
                    min="0"
                  />
                </div>
                <div>
                  <label className="flex items-center text-sm font-medium text-gray-600 mb-1">Ladies Seat</label>
                  <select
                    name="inventoryItems.0.ladiesSeat"
                    value={formData.inventoryItems[0].ladiesSeat}
                    onChange={(e) => handleChange(e, 0)}
                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all"
                  >
                    <option value="false">No</option>
                    <option value="true">Yes</option>
                  </select>
                </div>
                <div>
                  <label className="flex items-center text-sm font-medium text-gray-600 mb-1">Name</label>
                  <input
                    type="text"
                    name="inventoryItems.0.passenger.name"
                    value={formData.inventoryItems[0].passenger.name}
                    onChange={(e) => handleChange(e, 0)}
                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all"
                    required
                  />
                </div>
                <div>
                  <label className="flex items-center text-sm font-medium text-gray-600 mb-1">Mobile</label>
                  <input
                    type="number"
                    name="inventoryItems.0.passenger.mobile"
                    value={formData.inventoryItems[0].passenger.mobile}
                    onChange={(e) => handleChange(e, 0)}
                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all"
                    required
                  />
                </div>
                <div>
                  <label className="flex items-center text-sm font-medium text-gray-600 mb-1">Title</label>
                  <select
                    name="inventoryItems.0.passenger.title"
                    value={formData.inventoryItems[0].passenger.title}
                    onChange={(e) => handleChange(e, 0)}
                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all"
                  >
                    <option value="Mr">Mr</option>
                    <option value="Ms">Ms</option>
                    <option value="Mrs">Mrs</option>
                  </select>
                </div>
                <div>
                  <label className="flex items-center text-sm font-medium text-gray-600 mb-1">Email</label>
                  <input
                    type="email"
                    name="inventoryItems.0.passenger.email"
                    value={formData.inventoryItems[0].passenger.email}
                    onChange={(e) => handleChange(e, 0)}
                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all"
                  />
                </div>
                <div>
                  <label className="flex items-center text-sm font-medium text-gray-600 mb-1">Age</label>
                  <input
                    type="number"
                    name="inventoryItems.0.passenger.age"
                    value={formData.inventoryItems[0].passenger.age}
                    onChange={(e) => handleChange(e, 0)}
                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all"
                    min="1"
                    required
                  />
                </div>
                <div>
                  <label className="flex items-center text-sm font-medium text-gray-600 mb-1">Gender</label>
                  <select
                    name="inventoryItems.0.passenger.gender"
                    value={formData.inventoryItems[0].passenger.gender}
                    onChange={(e) => handleChange(e, 0)}
                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all"
                  >
                    <option value="MALE">Male</option>
                    <option value="FEMALE">Female</option>
                  </select>
                </div>
                <div>
                  <label className="flex items-center text-sm font-medium text-gray-600 mb-1">Address</label>
                  <input
                    type="text"
                    name="inventoryItems.0.passenger.address"
                    value={formData.inventoryItems[0].passenger.address}
                    onChange={(e) => handleChange(e, 0)}
                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all"
                  />
                </div>
                <div>
                  <label className="flex items-center text-sm font-medium text-gray-600 mb-1">ID Type</label>
                  <input
                    type="text"
                    name="inventoryItems.0.passenger.idType"
                    value={formData.inventoryItems[0].passenger.idType}
                    onChange={(e) => handleChange(e, 0)}
                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all"
                  />
                </div>
                <div>
                  <label className="flex items-center text-sm font-medium text-gray-600 mb-1">ID Number</label>
                  <input
                    type="text"
                    name="inventoryItems.0.passenger.idNumber"
                    value={formData.inventoryItems[0].passenger.idNumber}
                    onChange={(e) => handleChange(e, 0)}
                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all"
                  />
                </div>
                <div>
                  <label className="flex items-center text-sm font-medium text-gray-600 mb-1">Primary Passenger</label>
                  <select
                    name="inventoryItems.0.passenger.primary"
                    value={formData.inventoryItems[0].passenger.primary}
                    onChange={(e) => handleChange(e, 0)}
                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all"
                  >
                    <option value="0">No</option>
                    <option value="1">Yes</option>
                  </select>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || pointsLoading}
              className="w-full bg-gray-800 text-white py-3 px-4 rounded-lg hover:bg-black focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Blocking Ticket...
                </span>
              ) : "Block Ticket"}
            </button>
          </form>

          {/* Response and error handling */}
          <div className="px-6 pb-6">
            {Object.keys(errors).length > 0 && (
              <div className="mt-4 p-4 bg-red-50 border border-red-100 rounded-lg">
                <p className="text-red-600 text-sm flex items-center">
                  <AlertCircle size={16} className="mr-2" />
                  {Object.values(errors)[0]}
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
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default BlockTicket;