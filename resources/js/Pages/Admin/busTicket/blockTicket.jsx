import React, { useState } from "react";
import axios from "axios";

const BlockTicket = () => {
    const [formData, setFormData] = useState({
        availableTripId: "",
        boardingPointId: "",
        inventoryItems: {
            0: {
                seatName: "",
                fare: "",
                serviceTax: "",
                operatorServiceCharge: "",
                ladiesSeat: "false",
                passenger: {
                    name: "",
                    title: "Mr",
                    mobile: "",
                    email: "",
                    age: "",
                    gender: "MALE",
                    address: "",
                    idType: "",
                    idNumber: "",
                    primary: "1",
                },
            },
        },
    });

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);

    const handleInventoryChange = (event) => {
        const { name, value } = event.target;
        setFormData((prev) => ({
            ...prev,
            inventoryItems: {
                ...prev.inventoryItems,
                0: {
                    ...prev.inventoryItems[0],
                    [name]: value,
                },
            },
        }));
    };

    const handlePassengerChange = (event) => {
        const { name, value } = event.target;
        setFormData((prev) => ({
            ...prev,
            inventoryItems: {
                ...prev.inventoryItems,
                0: {
                    ...prev.inventoryItems[0],
                    passenger: {
                        ...prev.inventoryItems[0].passenger,
                        [name]: value,
                    },
                },
            },
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        setLoading(true);

        try {
            const formattedData = {
                availableTripId: Number(formData.availableTripId),
                boardingPointId: Number(formData.boardingPointId),
                inventoryItems: {
                    0: {
                        seatName: formData.inventoryItems[0].seatName,
                        fare: Number(formData.inventoryItems[0].fare),
                        serviceTax: Number(formData.inventoryItems[0].serviceTax),
                        operatorServiceCharge: Number(formData.inventoryItems[0].operatorServiceCharge),
                        ladiesSeat: formData.inventoryItems[0].ladiesSeat,
                        passenger: {
                            name: formData.inventoryItems[0].passenger.name,
                            mobile: Number(formData.inventoryItems[0].passenger.mobile),
                            title: formData.inventoryItems[0].passenger.title,
                            email: formData.inventoryItems[0].passenger.email,
                            age: Number(formData.inventoryItems[0].passenger.age),
                            gender: formData.inventoryItems[0].passenger.gender,
                            address: formData.inventoryItems[0].passenger.address,
                            idType: formData.inventoryItems[0].passenger.idType,
                            idNumber: formData.inventoryItems[0].passenger.idNumber,
                            primary: formData.inventoryItems[0].passenger.primary
                        }
                    }
                }
            };

            const response = await axios.post(
                "/api/bus/block-ticket",
                formattedData,
                {
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json"
                    }
                }
            );

            if (response.data.status === "SUCCESS") {
                setSuccess("Ticket blocked successfully!");
                // Optional: Reset form
                // setFormData({...initial state...});
            } else {
                setError(response.data.message || "Failed to block ticket");
            }
        } catch (error) {
            console.error("Error while calling API:", error);
            setError(
                error.response?.data?.message || 
                error.response?.data?.error || 
                "An error occurred while processing your request"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <h1 className="text-xl font-bold mb-6">Block Ticket Form</h1>
            
            {error && (
                <div className="mb-4 p-4 bg-red-100 text-red-700 rounded">
                    {error}
                </div>
            )}
            
            {success && (
                <div className="mb-4 p-4 bg-green-100 text-green-700 rounded">
                    {success}
                </div>
            )}

            <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
                <label className="col-span-2 font-semibold">
                    Available Trip Information
                </label>
                <input
                    type="number"
                    name="availableTripId"
                    placeholder="Available Trip ID"
                    value={formData.availableTripId}
                    onChange={(e) =>
                        setFormData({
                            ...formData,
                            availableTripId: e.target.value,
                        })
                    }
                    className="p-2 border rounded"
                    required
                />
                <input
                    type="number"
                    name="boardingPointId"
                    placeholder="Boarding Point ID"
                    value={formData.boardingPointId}
                    onChange={(e) =>
                        setFormData({
                            ...formData,
                            boardingPointId: e.target.value,
                        })
                    }
                    className="p-2 border rounded"
                    required
                />

                <label className="col-span-2 font-semibold mt-4">
                    Seat & Pricing Information
                </label>
                <input
                    type="text"
                    name="seatName"
                    placeholder="Seat Name"
                    value={formData.inventoryItems[0].seatName}
                    onChange={handleInventoryChange}
                    className="p-2 border rounded"
                    required
                />
                <input
                    type="number"
                    name="fare"
                    placeholder="Fare"
                    step="0.01"
                    value={formData.inventoryItems[0].fare}
                    onChange={handleInventoryChange}
                    className="p-2 border rounded"
                    required
                />
                <input
                    type="number"
                    name="serviceTax"
                    placeholder="Service Tax"
                    step="0.01"
                    value={formData.inventoryItems[0].serviceTax}
                    onChange={handleInventoryChange}
                    className="p-2 border rounded"
                    required
                />
                <input
                    type="number"
                    name="operatorServiceCharge"
                    placeholder="Operator Service Charge"
                    step="0.01"
                    value={formData.inventoryItems[0].operatorServiceCharge}
                    onChange={handleInventoryChange}
                    className="p-2 border rounded"
                    required
                />
                <select
                    name="ladiesSeat"
                    value={formData.inventoryItems[0].ladiesSeat}
                    onChange={handleInventoryChange}
                    className="p-2 border rounded"
                    required
                >
                    <option value="false">No</option>
                    <option value="true">Yes</option>
                </select>

                <label className="col-span-2 font-semibold mt-4">
                    Passenger Information
                </label>
                <input
                    type="text"
                    name="name"
                    placeholder="Passenger Name"
                    value={formData.inventoryItems[0].passenger.name}
                    onChange={handlePassengerChange}
                    className="p-2 border rounded"
                    required
                />
                <select
                    name="title"
                    value={formData.inventoryItems[0].passenger.title}
                    onChange={handlePassengerChange}
                    className="p-2 border rounded"
                    required
                >
                    <option value="Mr">Mr</option>
                    <option value="Ms">Ms</option>
                    <option value="Mrs">Mrs</option>
                </select>
                <input
                    type="tel"
                    name="mobile"
                    placeholder="Mobile Number"
                    value={formData.inventoryItems[0].passenger.mobile}
                    onChange={handlePassengerChange}
                    className="p-2 border rounded"
                    required
                />
                <input
                    type="email"
                    name="email"
                    placeholder="Email Address"
                    value={formData.inventoryItems[0].passenger.email}
                    onChange={handlePassengerChange}
                    className="p-2 border rounded"
                    required
                />
                <input
                    type="number"
                    name="age"
                    placeholder="Age"
                    value={formData.inventoryItems[0].passenger.age}
                    onChange={handlePassengerChange}
                    className="p-2 border rounded"
                    required
                />
                <select
                    name="gender"
                    value={formData.inventoryItems[0].passenger.gender}
                    onChange={handlePassengerChange}
                    className="p-2 border rounded"
                    required
                >
                    <option value="MALE">Male</option>
                    <option value="FEMALE">Female</option>
                </select>
                <input
                    type="text"
                    name="address"
                    placeholder="Address"
                    value={formData.inventoryItems[0].passenger.address}
                    onChange={handlePassengerChange}
                    className="p-2 border rounded"
                    required
                />
                <input
                    type="text"
                    name="idType"
                    placeholder="ID Type (e.g., Aadhar, PAN)"
                    value={formData.inventoryItems[0].passenger.idType}
                    onChange={handlePassengerChange}
                    className="p-2 border rounded"
                    required
                />
                <input
                    type="text"
                    name="idNumber"
                    placeholder="ID Number"
                    value={formData.inventoryItems[0].passenger.idNumber}
                    onChange={handlePassengerChange}
                    className="p-2 border rounded"
                    required
                />
                <select
                    name="primary"
                    value={formData.inventoryItems[0].passenger.primary}
                    onChange={handlePassengerChange}
                    className="p-2 border rounded"
                    required
                >
                    <option value="1">Yes</option>
                    <option value="0">No</option>
                </select>

                <button
                    type="submit"
                    className="col-span-2 p-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed mt-4"
                    disabled={loading}
                >
                    {loading ? "Processing..." : "Block Ticket"}
                </button>
            </form>
        </div>
    );
};

export default BlockTicket;