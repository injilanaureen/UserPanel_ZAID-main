import React, { useState, useEffect } from 'react';
import { router } from '@inertiajs/react';
import axios from "axios";
import AdminLayout from '@/Layouts/AdminLayout';
import { Bus, MapPin, User, CreditCard, Ticket, AlertCircle, CheckCircle, Search } from 'lucide-react';

const INPUT_CLASS = "w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all";

const FormField = ({ label, icon, children, error }) => (
  <div>
    <label className="flex items-center text-sm font-medium text-gray-600 mb-1">
      {icon} {label}
    </label>
    {children}
    {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
  </div>
);

const BlockTicket = () => {
  const initialFormData = {
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
        idType: 'PANCARD', 
        idNumber: '', 
        primary: '0'
      }
    }]
  };

  const [formData, setFormData] = useState(initialFormData);
  const [state, setState] = useState({
    errors: {}, 
    loading: false, 
    pointsLoading: false,
    boardingPoints: [], 
    droppingPoints: [],
    selectedBoardingAddress: '', 
    selectedDroppingAddress: '',
    success: '', 
    sourceCities: [], 
    destinationCities: [],
    sourceSearch: '', 
    destSearch: '',
    showSourceDropdown: false, 
    showDestDropdown: false,
    availableSeats: []
  });

  useEffect(() => {
    if (formData.availableTripId) fetchTripDetails();
    fetchCities();
  }, [formData.availableTripId]);

  const fetchTripDetails = async () => {
    setState(prev => ({ ...prev, pointsLoading: true }));
    try {
      const token = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
      const { data } = await axios.post('/admin/busTicket/fetchTripDetails', 
        { trip_id: formData.availableTripId },
        { headers: { 
          'Accept': 'application/json', 
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': token 
        }}
      );
      if (data.status && data.data) {
        // Extract seat details from the response
        const seats = data.data.seats || [];
        const formattedSeats = seats.map(seat => ({
          seatName: seat.name,
          fare: seat.fare.toString(),
          serviceTax: seat.serviceTaxAbsolute?.toString() || '0',
          operatorServiceCharge: seat.operatorServiceChargeAbsolute?.toString() || '0',
          ladiesSeat: seat.ladiesSeat === 'true' ? 'true' : 'false'
        }));

        setState(prev => ({ 
          ...prev, 
          boardingPoints: data.data.boardingTimes || [],
          droppingPoints: data.data.droppingTimes || [],
          availableSeats: formattedSeats
        }));

        // Update the first inventory item with the first available seat (if any)
        if (formattedSeats.length > 0) {
          setFormData(prev => ({
            ...prev,
            serviceCharge: (data.data.agentServiceCharge || '0').toString(),
            inventoryItems: [{
              ...prev.inventoryItems[0],
              seatName: formattedSeats[0].seatName,
              fare: formattedSeats[0].fare,
              serviceTax: formattedSeats[0].serviceTax,
              operatorServiceCharge: formattedSeats[0].operatorServiceCharge,
              ladiesSeat: formattedSeats[0].ladiesSeat
            }]
          }));
        }
      }
    } catch (err) {
      setState(prev => ({ ...prev, errors: { tripDetails: 'Failed to load trip details' } }));
    } finally {
      setState(prev => ({ ...prev, pointsLoading: false }));
    }
  };

  const fetchCities = async () => {
    try {
      const token = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
      const response = await fetch('/admin/busTicket/fetchSourceCities', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': token 
        }
      });
      const data = await response.json();
      if (data.status && data.data.cities) {
        setState(prev => ({ ...prev, sourceCities: data.data.cities, destinationCities: data.data.cities }));
      }
    } catch (err) {
      setState(prev => ({ ...prev, errors: { cities: err.message } }));
    }
  };

  const handleChange = (e, index = 0) => {
    const { name, value } = e.target;
    setState(prev => ({ ...prev, errors: {}, success: '' }));
    
    if (name.includes('passenger.')) {
      const field = name.split('passenger.')[1];
      updateInventory(index, 'passenger', field, value);
    } else if (name.includes('inventoryItems.')) {
      updateInventory(index, null, name.split('.')[2], value);
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const updateInventory = (index, nestedKey, field, value) => {
    setFormData(prev => ({
      ...prev,
      inventoryItems: prev.inventoryItems.map((item, i) => 
        i === index ? 
          nestedKey ? 
            { ...item, [nestedKey]: { ...item[nestedKey], [field]: value } } : 
            { ...item, [field]: value } 
          : item
      )
    }));
  };

  const handlePointChange = (type) => (e) => {
    const value = e.target.value;
    setState(prev => ({ ...prev, 
      [type === 'boarding' ? 'selectedBoardingAddress' : 'selectedDroppingAddress']: value 
    }));
    const points = type === 'boarding' ? state.boardingPoints : state.droppingPoints;
    const point = points.find(p => p.address === value);
    if (point) setFormData(prev => ({ ...prev, [type + 'PointId']: point.bpId }));
  };

  const handleCitySelect = (type, city) => {
    setFormData(prev => ({ ...prev, [type]: city.id }));
    setState(prev => ({ ...prev, 
      [type === 'source' ? 'sourceSearch' : 'destSearch']: city.name,
      [type === 'source' ? 'showSourceDropdown' : 'showDestDropdown']: false
    }));
  };

  const handleSeatChange = (e, index = 0) => {
    const selectedSeatName = e.target.value;
    const selectedSeat = state.availableSeats.find(seat => seat.seatName === selectedSeatName);
    if (selectedSeat) {
      setFormData(prev => ({
        ...prev,
        inventoryItems: prev.inventoryItems.map((item, i) => 
          i === index ? {
            ...item,
            seatName: selectedSeat.seatName,
            fare: selectedSeat.fare,
            serviceTax: selectedSeat.serviceTax,
            operatorServiceCharge: selectedSeat.operatorServiceCharge,
            ladiesSeat: selectedSeat.ladiesSeat
          } : item
        )
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setState(prev => ({ ...prev, loading: true, errors: {}, success: '' }));
    console.log('Form Data Submitted:', JSON.stringify(formData, null, 2));
    router.post('/admin/bus-ticket/block/api', formData, {
      onSuccess: () => {
        setState(prev => ({ ...prev, loading: false, success: 'Ticket blocked successfully!' }));
        setFormData(initialFormData);
        setState(prev => ({ 
          ...prev, 
          sourceSearch: '', 
          destSearch: '',
          selectedBoardingAddress: '',
          selectedDroppingAddress: ''
        }));
      },
      onError: (err) => setState(prev => ({ ...prev, loading: false, errors: err }))
    });
  };

  const handleClickOutside = (e, dropdownType) => {
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setState(prev => ({ 
        ...prev, 
        [dropdownType === 'source' ? 'showSourceDropdown' : 'showDestDropdown']: false 
      }));
    }
  };

  const filteredCities = (cities, search) => 
    cities.filter(city => city.name.toLowerCase().includes(search.toLowerCase())).slice(0, 10);

  return (
    <AdminLayout>
      <div className="max-w-full">
        <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
          <div className="bg-gradient-to-tr from-gray-400 to-black py-4 px-6">
            <h2 className="text-3xl font-semibold text-white">Reserve Bus Ticket</h2>
          </div>
          <form onSubmit={handleSubmit} className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <FormField 
                label="Available Trip ID" 
                icon={<Bus size={20} className="mr-2 text-green-500" />}
                error={state.errors.availableTripId}
              >
                <input 
                  type="text" 
                  name="availableTripId" 
                  value={formData.availableTripId} 
                  onChange={handleChange} 
                  className={INPUT_CLASS} 
                  required 
                />
              </FormField>
              <FormField 
                label="Boarding Point" 
                icon={<MapPin size={20} className="mr-2 text-yellow-500" />}
                error={state.errors.boardingPointId}
              >
                <select 
                  value={state.selectedBoardingAddress} 
                  onChange={handlePointChange('boarding')} 
                  className={INPUT_CLASS} 
                  disabled={!formData.availableTripId || state.pointsLoading} 
                  required
                >
                  <option key="default" value="">Select boarding point</option>
                  {state.pointsLoading ? (
                    <option>Loading...</option>
                  ) : (
                    state.boardingPoints.map((point, i) => (
                      <option key={i} value={point.address}>
                        {point.address} (ID: {point.bpId})
                      </option>
                    ))
                  )}
                </select>
              </FormField>
              <FormField 
                label="Dropping Point" 
                icon={<MapPin size={20} className="mr-2 text-red-500" />}
                error={state.errors.droppingPointId}
              >
                <select 
                  value={state.selectedDroppingAddress} 
                  onChange={handlePointChange('dropping')} 
                  className={INPUT_CLASS} 
                  disabled={!formData.availableTripId || state.pointsLoading} 
                  required
                >
                  <option key="default" value="">Select dropping point</option>
                  {state.pointsLoading ? (
                    <option>Loading...</option>
                  ) : (
                    state.droppingPoints.map((point, i) => (
                      <option key={i} value={point.address}>
                        {point.address} (ID: {point.bpId})
                      </option>
                    ))
                  )}
                </select>
              </FormField>
              <FormField 
                label="Source City" 
                icon={<MapPin size={20} className="mr-2 text-blue-500" />}
                error={state.errors.source}
              >
                <div 
                  className="relative" 
                  onBlur={(e) => handleClickOutside(e, 'source')}
                >
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <input 
                    type="text" 
                    value={state.sourceSearch} 
                    onChange={e => setState(prev => ({ ...prev, sourceSearch: e.target.value, showSourceDropdown: true }))} 
                    onFocus={() => setState(prev => ({ ...prev, showSourceDropdown: true }))}
                    className={`${INPUT_CLASS} pl-10`} 
                    placeholder="Search source city..."
                    required 
                  />
                  {state.showSourceDropdown && filteredCities(state.sourceCities, state.sourceSearch).length > 0 && (
                    <ul className="absolute z-10 w-full bg-white border border-gray-200 rounded-lg mt-1 max-h-60 overflow-y-auto shadow-lg">
                      {filteredCities(state.sourceCities, state.sourceSearch).map(city => (
                        <li 
                          key={city.id} 
                          onClick={() => handleCitySelect('source', city)} 
                          className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                        >
                          {city.name}, {city.state} (ID: {city.id})
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </FormField>
              <FormField 
                label="Destination City" 
                icon={<MapPin size={20} className="mr-2 text-purple-500" />}
                error={state.errors.destination}
              >
                <div 
                  className="relative"
                  onBlur={(e) => handleClickOutside(e, 'destination')}
                >
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <input 
                    type="text" 
                    value={state.destSearch} 
                    onChange={e => setState(prev => ({ ...prev, destSearch: e.target.value, showDestDropdown: true }))} 
                    onFocus={() => setState(prev => ({ ...prev, showDestDropdown: true }))}
                    className={`${INPUT_CLASS} pl-10`} 
                    placeholder="Search destination city..."
                    required 
                  />
                  {state.showDestDropdown && filteredCities(state.destinationCities, state.destSearch).length > 0 && (
                    <ul className="absolute z-10 w-full bg-white border border-gray-200 rounded-lg mt-1 max-h-60 overflow-y-auto shadow-lg">
                      {filteredCities(state.destinationCities, state.destSearch).map(city => (
                        <li 
                          key={city.id} 
                          onClick={() => handleCitySelect('destination', city)} 
                          className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                        >
                          {city.name}, {city.state} (ID: {city.id})
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </FormField>
              <FormField 
                label="Booking Type" 
                icon={<Ticket size={20} className="mr-2 text-indigo-500" />}
                error={state.errors.bookingType}
              >
                <select name="bookingType" value={formData.bookingType} onChange={handleChange} className={INPUT_CLASS}>
                  <option value="ONLINE">Online</option>
                  <option value="OFFLINE">Offline</option>
                  <option value="STANDARD">Standard</option>
                </select>
              </FormField>
              <FormField 
                label="Service Charge" 
                icon={<CreditCard size={20} className="mr-2 text-teal-500" />}
                error={state.errors.serviceCharge}
              >
                <input 
                  type="number" 
                  name="serviceCharge" 
                  value={formData.serviceCharge} 
                  onChange={handleChange} 
                  className={INPUT_CLASS} 
                  min="0" 
                  disabled={state.pointsLoading} 
                />
              </FormField>
              <FormField 
                label="Payment Mode" 
                icon={<CreditCard size={20} className="mr-2 text-orange-500" />}
                error={state.errors.paymentMode}
              >
                <select name="paymentMode" value={formData.paymentMode} onChange={handleChange} className={INPUT_CLASS}>
                  <option value="CASH">Cash</option>
                  <option value="CARD">Card</option>
                  <option value="UPI">UPI</option>
                  <option value="NETBANKING">Netbanking</option>
                </select>
              </FormField>
            </div>

            <div className="border border-gray-200 rounded-lg p-6 mb-6">
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <User size={20} className="mr-2 text-gray-600" />Passenger Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField 
                  label="Seat Name" 
                  icon={<Ticket size={20} className="mr-2 text-gray-600" />}
                  error={state.errors['inventoryItems.0.seatName']}
                >
                  <select 
                    name="inventoryItems.0.seatName" 
                    value={formData.inventoryItems[0].seatName} 
                    onChange={(e) => handleSeatChange(e)} 
                    className={INPUT_CLASS}
                    disabled={!state.availableSeats.length}
                    required
                  >
                    <option key="default" value="">Select a seat</option>
                    {state.availableSeats.length === 0 ? (
                      <option value="">No seats available</option>
                    ) : (
                      state.availableSeats.map((seat, i) => (
                        <option key={i} value={seat.seatName}>
                          {seat.seatName} (₹{seat.fare})
                        </option>
                      ))
                    )}
                  </select>
                </FormField>
                <FormField 
                  label="Fare" 
                  icon={<CreditCard size={20} className="mr-2 text-gray-600" />}
                  error={state.errors['inventoryItems.0.fare']}
                >
                  <input 
                    type="number" 
                    name="inventoryItems.0.fare" 
                    value={formData.inventoryItems[0].fare} 
                    onChange={handleChange} 
                    className={INPUT_CLASS} 
                    min="0" 
                    readOnly 
                  />
                </FormField>
                <FormField 
                  label="Service Tax" 
                  icon={<CreditCard size={20} className="mr-2 text-gray-600" />}
                  error={state.errors['inventoryItems.0.serviceTax']}
                >
                  <input 
                    type="number" 
                    name="inventoryItems.0.serviceTax" 
                    value={formData.inventoryItems[0].serviceTax} 
                    onChange={handleChange} 
                    className={INPUT_CLASS} 
                    min="0" 
                    readOnly 
                  />
                </FormField>
                <FormField 
                  label="Operator Service Charge" 
                  icon={<CreditCard size={20} className="mr-2 text-gray-600" />}
                  error={state.errors['inventoryItems.0.operatorServiceCharge']}
                >
                  <input 
                    type="number" 
                    name="inventoryItems.0.operatorServiceCharge" 
                    value={formData.inventoryItems[0].operatorServiceCharge} 
                    onChange={handleChange} 
                    className={INPUT_CLASS} 
                    min="0" 
                    readOnly 
                  />
                </FormField>
                <FormField 
                  label="Ladies Seat" 
                  icon={<User size={20} className="mr-2 text-gray-600" />}
                  error={state.errors['inventoryItems.0.ladiesSeat']}
                >
                  <select 
                    name="inventoryItems.0.ladiesSeat" 
                    value={formData.inventoryItems[0].ladiesSeat} 
                    onChange={handleChange} 
                    className={INPUT_CLASS}
                    disabled
                  >
                    <option value="false">No</option>
                    <option value="true">Yes</option>
                  </select>
                </FormField>
                {Object.entries(formData.inventoryItems[0].passenger).map(([subKey, subValue]) => (
                 <FormField 
                 key={subKey} 
                 label={subKey.charAt(0).toUpperCase() + subKey.slice(1)}
                 icon={<User size={20} className="mr-2 text-gray-600" />}
                 error={state.errors[`inventoryItems.0.passenger.${subKey}`]}
               >
                 {subKey === 'idType' ? (
                   <select 
                     name={`inventoryItems.0.passenger.${subKey}`} 
                     value={subValue} 
                     onChange={handleChange} 
                     className={INPUT_CLASS}
                     required
                   >
                     <option value="Pancard">Pancard</option>
                     <option value="Aadhaar Card">Aadhaar Card</option>
                   </select>
                 ) : ['title', 'gender', 'primary'].includes(subKey) ? (
                   <select 
                     name={`inventoryItems.0.passenger.${subKey}`} 
                     value={subValue} 
                     onChange={handleChange} 
                     className={INPUT_CLASS}
                   >
                     {subKey === 'title' && ['Mr', 'Ms', 'Mrs'].map(opt => <option key={opt} value={opt}>{opt}</option>)}
                     {subKey === 'gender' && ['MALE', 'FEMALE'].map(opt => <option key={opt} value={opt}>{opt}</option>)}
                     {subKey === 'primary' && ['0', '1'].map(opt => <option key={opt} value={opt}>{opt === '0' ? 'No' : 'Yes'}</option>)}
                   </select>
                 ) : (
                   <input 
                     type={subKey === 'email' ? 'email' : subKey === 'age' || subKey === 'mobile' ? 'number' : 'text'} 
                     name={`inventoryItems.0.passenger.${subKey}`} 
                     value={subValue} 
                     onChange={handleChange} 
                     className={INPUT_CLASS} 
                     {...(subKey === 'age' ? { min: 1 } : {})} 
                     required={['name', 'mobile', 'age'].includes(subKey)} 
                   />
                 )}
               </FormField>
                ))}
              </div>
            </div>

            <button 
              type="submit" 
              disabled={state.loading || state.pointsLoading} 
              className="w-full bg-gray-800 text-white py-3 px-4 rounded-lg hover:bg-black focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
            >
              {state.loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 8.291l5.657-5.657C13.536 13.755 12.768 12 10.34 12H6c0-1.659.635-3.155 1.657-4.243C8.219 6.863 9.396 6.18 10.725 6.039 10.9 6.687 10.568 6.997 11 7c-0.031 0.001-0.326 0.016-0.743 0.656C11.091 7.891 12 8.973 12 10.7c0 2.172-1.7 4.257-4.8 7.2l1.086 1.623L12 18c2.333 0 4.167 1 5.5 3h-1c-1.167-1.5-2.667-2.167-4.5-2z" />
                  </svg>
                  Blocking Ticket...
                </span>
              ) : "Block Ticket"}
            </button>
          </form>

          <div className="px-6 pb-6">
            {Object.keys(state.errors).length > 0 && (
              <div className="mt-4 p-4 bg-red-50 border border-red-100 rounded-lg">
                <p className="text-red-600 text-sm flex items-center">
                  <AlertCircle size={16} className="mr-2" />
                  {Object.values(state.errors)[0]}
                </p>
              </div>
            )}
            {state.success && (
              <div className="mt-4 p-4 bg-green-50 border border-green-100 rounded-lg">
                <p className="text-green-600 text-sm flex items-center">
                  <CheckCircle size={16} className="mr-2" />
                  {state.success}
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