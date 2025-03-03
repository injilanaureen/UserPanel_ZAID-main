import React, { useEffect, useState } from "react";
import axios from "axios";

const CheckBookedTicket = () => {
  const [ticketData, setTicketData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.post("/api/bus/check-booked-ticket", {
          refid: 5,
        });
        setTicketData(response.data.data);
      } catch (error) {
        console.error("Error fetching ticket data:", error);
      }
    };

    fetchData();
  }, []);

  if (!ticketData) return <div>Loading...</div>;

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white rounded-xl shadow-md space-y-4">
      <h1 className="text-2xl font-bold text-center">Booked Ticket Details</h1>
      <div className="space-y-2">
        <p>
          <strong>Status:</strong> {ticketData.status}
        </p>
        <p>
          <strong>Bus Type:</strong> {ticketData.busType}
        </p>
        <p>
          <strong>Source:</strong> {ticketData.sourceCity}
        </p>
        <p>
          <strong>Destination:</strong> {ticketData.destinationCity}
        </p>
        <p>
          <strong>Pickup Location:</strong> {ticketData.pickupLocation}
        </p>
        <p>
          <strong>Drop Location:</strong> {ticketData.dropLocation}
        </p>
        <p>
          <strong>PNR:</strong> {ticketData.pnr}
        </p>
        <p>
          <strong>Travel Date:</strong> {ticketData.doj}
        </p>
      </div>
      <h2 className="text-xl font-semibold mt-4">Passengers</h2>
      <div className="grid grid-cols-2 gap-6">
        {ticketData.inventoryItems.map((item, index) => (
          <div
            key={index}
            className="p-4 bg-gray-100 rounded-lg shadow-sm border border-gray-200"
          >
            <p>
              <strong>Seat Name:</strong> {item.seatName}
            </p>
            <p>
              <strong>Passenger Name:</strong> {item.passenger.name} ({item.passenger.gender})
            </p>
            <p>
              <strong>Age:</strong> {item.passenger.age}
            </p>
            <p>
              <strong>Email:</strong> {item.passenger.email}
            </p>
            <p>
              <strong>Mobile:</strong> {item.passenger.mobile}
            </p>
          </div>
        ))}
      </div>
      <h2 className="text-xl font-semibold mt-4">Other Details</h2>
      <div className="grid grid-cols-2 gap-6"></div>
      <div>
        <p>
          <strong>Service Start Time:</strong> {ticketData.serviceStartTime}
        </p>
        <p>
          <strong>Cancellation Policy:</strong> {ticketData.cancellationPolicy}
        </p>
      </div>
    </div>
  );
};

export default CheckBookedTicket;
