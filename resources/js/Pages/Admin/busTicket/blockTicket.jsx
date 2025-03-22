import React, { useState } from 'react';
import { router } from '@inertiajs/react';
import axios from "axios";
import AdminLayout from '@/Layouts/AdminLayout';
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

  const handleChange = (e, index = 0) => {
    const { name, value } = e.target;

    // Handle nested passenger fields
    if (name.includes('passenger.')) {
      const passengerField = name.split('passenger.')[1]; // e.g., "name", "mobile", etc.
      setFormData((prev) => ({
        ...prev,
        inventoryItems: prev.inventoryItems.map((item, i) =>
          i === index
            ? {
                ...item,
                passenger: {
                  ...item.passenger,
                  [passengerField]: value,
                },
              }
            : item
        ),
      }));
    } 
    // Handle inventoryItems fields (e.g., seatName, fare)
    else if (name.includes('inventoryItems.')) {
      const field = name.split('.')[2]; // e.g., "seatName", "fare"
      setFormData((prev) => ({
        ...prev,
        inventoryItems: prev.inventoryItems.map((item, i) =>
          i === index ? { ...item, [field]: value } : item
        ),
      }));
    } 
    // Handle top-level fields (e.g., availableTripId, source)
    else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    router.post('/admin/bus-ticket/block/api', formData, {
      onSuccess: () => {
        setLoading(false);
        alert('Ticket blocked successfully!');
      },
      onError: (err) => {
        setLoading(false);
        setErrors(err);
      },
    });
  };

  return (
    <AdminLayout>
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Block Bus Ticket</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Trip Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block">Available Trip ID</label>
            <input
              type="number"
              name="availableTripId"
              value={formData.availableTripId}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
            {errors.availableTripId && <span className="text-red-500">{errors.availableTripId}</span>}
          </div>
          <div>
            <label className="block">Boarding Point ID</label>
            <input
              type="number"
              name="boardingPointId"
              value={formData.boardingPointId}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
            {errors.boardingPointId && <span className="text-red-500">{errors.boardingPointId}</span>}
          </div>
          <div>
            <label className="block">Dropping Point ID</label>
            <input
              type="number"
              name="droppingPointId"
              value={formData.droppingPointId}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
            {errors.droppingPointId && <span className="text-red-500">{errors.droppingPointId}</span>}
          </div>
          <div>
            <label className="block">Source</label>
            <input
              type="text"
              name="source"
              value={formData.source}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
            {errors.source && <span className="text-red-500">{errors.source}</span>}
          </div>
          <div>
            <label className="block">Destination</label>
            <input
              type="text"
              name="destination"
              value={formData.destination}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
            {errors.destination && <span className="text-red-500">{errors.destination}</span>}
          </div>
        </div>

        {/* Booking Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block">Booking Type</label>
            <select
              name="bookingType"
              value={formData.bookingType}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            >
              <option value="ONLINE">Online</option>
              <option value="OFFLINE">Offline</option>
              <option value="STANDARD">Standard</option>
            </select>
            {errors.bookingType && <span className="text-red-500">{errors.bookingType}</span>}
          </div>
          <div>
            <label className="block">Service Charge</label>
            <input
              type="number"
              name="serviceCharge"
              value={formData.serviceCharge}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
            {errors.serviceCharge && <span className="text-red-500">{errors.serviceCharge}</span>}
          </div>
          <div>
            <label className="block">Payment Mode</label>
            <select
              name="paymentMode"
              value={formData.paymentMode}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            >
              <option value="CASH">Cash</option>
              <option value="CARD">Card</option>
              <option value="UPI">UPI</option>
              <option value="NETBANKING">Netbanking</option>
            </select>
            {errors.paymentMode && <span className="text-red-500">{errors.paymentMode}</span>}
          </div>
        </div>

        {/* Inventory Items */}
        <div className="border p-4 rounded">
          <h2 className="text-xl font-semibold mb-4">Passenger Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block">Seat Name</label>
              <input
                type="text"
                name="inventoryItems.0.seatName"
                value={formData.inventoryItems[0].seatName}
                onChange={(e) => handleChange(e, 0)}
                className="w-full p-2 border rounded"
              />
              {errors['inventoryItems.0.seatName'] && <span className="text-red-500">{errors['inventoryItems.0.seatName']}</span>}
            </div>
            <div>
              <label className="block">Fare</label>
              <input
                type="number"
                name="inventoryItems.0.fare"
                value={formData.inventoryItems[0].fare}
                onChange={(e) => handleChange(e, 0)}
                className="w-full p-2 border rounded"
              />
              {errors['inventoryItems.0.fare'] && <span className="text-red-500">{errors['inventoryItems.0.fare']}</span>}
            </div>
            <div>
              <label className="block">Service Tax</label>
              <input
                type="number"
                name="inventoryItems.0.serviceTax"
                value={formData.inventoryItems[0].serviceTax}
                onChange={(e) => handleChange(e, 0)}
                className="w-full p-2 border rounded"
              />
              {errors['inventoryItems.0.serviceTax'] && <span className="text-red-500">{errors['inventoryItems.0.serviceTax']}</span>}
            </div>
            <div>
              <label className="block">Operator Service Charge</label>
              <input
                type="number"
                name="inventoryItems.0.operatorServiceCharge"
                value={formData.inventoryItems[0].operatorServiceCharge}
                onChange={(e) => handleChange(e, 0)}
                className="w-full p-2 border rounded"
              />
              {errors['inventoryItems.0.operatorServiceCharge'] && <span className="text-red-500">{errors['inventoryItems.0.operatorServiceCharge']}</span>}
            </div>
            <div>
              <label className="block">Ladies Seat</label>
              <select
                name="inventoryItems.0.ladiesSeat"
                value={formData.inventoryItems[0].ladiesSeat}
                onChange={(e) => handleChange(e, 0)}
                className="w-full p-2 border rounded"
              >
                <option value="false">No</option>
                <option value="true">Yes</option>
              </select>
              {errors['inventoryItems.0.ladiesSeat'] && <span className="text-red-500">{errors['inventoryItems.0.ladiesSeat']}</span>}
            </div>
          </div>

          {/* Passenger Details */}
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block">Name</label>
              <input
                type="text"
                name="inventoryItems.0.passenger.name"
                value={formData.inventoryItems[0].passenger.name}
                onChange={(e) => handleChange(e, 0)}
                className="w-full p-2 border rounded"
              />
              {errors['inventoryItems.0.passenger.name'] && <span className="text-red-500">{errors['inventoryItems.0.passenger.name']}</span>}
            </div>
            <div>
              <label className="block">Mobile</label>
              <input
                type="number"
                name="inventoryItems.0.passenger.mobile"
                value={formData.inventoryItems[0].passenger.mobile}
                onChange={(e) => handleChange(e, 0)}
                className="w-full p-2 border rounded"
              />
              {errors['inventoryItems.0.passenger.mobile'] && <span className="text-red-500">{errors['inventoryItems.0.passenger.mobile']}</span>}
            </div>
            <div>
              <label className="block">Title</label>
              <select
                name="inventoryItems.0.passenger.title"
                value={formData.inventoryItems[0].passenger.title}
                onChange={(e) => handleChange(e, 0)}
                className="w-full p-2 border rounded"
              >
                <option value="Mr">Mr</option>
                <option value="Ms">Ms</option>
                <option value="Mrs">Mrs</option>
              </select>
              {errors['inventoryItems.0.passenger.title'] && <span className="text-red-500">{errors['inventoryItems.0.passenger.title']}</span>}
            </div>
            <div>
              <label className="block">Email</label>
              <input
                type="email"
                name="inventoryItems.0.passenger.email"
                value={formData.inventoryItems[0].passenger.email}
                onChange={(e) => handleChange(e, 0)}
                className="w-full p-2 border rounded"
              />
              {errors['inventoryItems.0.passenger.email'] && <span className="text-red-500">{errors['inventoryItems.0.passenger.email']}</span>}
            </div>
            <div>
              <label className="block">Age</label>
              <input
                type="number"
                name="inventoryItems.0.passenger.age"
                value={formData.inventoryItems[0].passenger.age}
                onChange={(e) => handleChange(e, 0)}
                className="w-full p-2 border rounded"
              />
              {errors['inventoryItems.0.passenger.age'] && <span className="text-red-500">{errors['inventoryItems.0.passenger.age']}</span>}
            </div>
            <div>
              <label className="block">Gender</label>
              <select
                name="inventoryItems.0.passenger.gender"
                value={formData.inventoryItems[0].passenger.gender}
                onChange={(e) => handleChange(e, 0)}
                className="w-full p-2 border rounded"
              >
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
              </select>
              {errors['inventoryItems.0.passenger.gender'] && <span className="text-red-500">{errors['inventoryItems.0.passenger.gender']}</span>}
            </div>
            <div>
              <label className="block">Address</label>
              <input
                type="text"
                name="inventoryItems.0.passenger.address"
                value={formData.inventoryItems[0].passenger.address}
                onChange={(e) => handleChange(e, 0)}
                className="w-full p-2 border rounded"
              />
              {errors['inventoryItems.0.passenger.address'] && <span className="text-red-500">{errors['inventoryItems.0.passenger.address']}</span>}
            </div>
            <div>
              <label className="block">ID Type</label>
              <input
                type="text"
                name="inventoryItems.0.passenger.idType"
                value={formData.inventoryItems[0].passenger.idType}
                onChange={(e) => handleChange(e, 0)}
                className="w-full p-2 border rounded"
              />
              {errors['inventoryItems.0.passenger.idType'] && <span className="text-red-500">{errors['inventoryItems.0.passenger.idType']}</span>}
            </div>
            <div>
              <label className="block">ID Number</label>
              <input
                type="text"
                name="inventoryItems.0.passenger.idNumber"
                value={formData.inventoryItems[0].passenger.idNumber}
                onChange={(e) => handleChange(e, 0)}
                className="w-full p-2 border rounded"
              />
              {errors['inventoryItems.0.passenger.idNumber'] && <span className="text-red-500">{errors['inventoryItems.0.passenger.idNumber']}</span>}
            </div>
            <div>
              <label className="block">Primary Passenger</label>
              <select
                name="inventoryItems.0.passenger.primary"
                value={formData.inventoryItems[0].passenger.primary}
                onChange={(e) => handleChange(e, 0)}
                className="w-full p-2 border rounded"
              >
                <option value="0">No</option>
                <option value="1">Yes</option>
              </select>
              {errors['inventoryItems.0.passenger.primary'] && <span className="text-red-500">{errors['inventoryItems.0.passenger.primary']}</span>}
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div>
          <button
            type="submit"
            disabled={loading}
            className={`w-full p-2 text-white rounded ${loading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'}`}
          >
            {loading ? 'Blocking Ticket...' : 'Block Ticket'}
          </button>
        </div>
      </form>
    </div>
    </AdminLayout>
  );
};

export default BlockTicket;