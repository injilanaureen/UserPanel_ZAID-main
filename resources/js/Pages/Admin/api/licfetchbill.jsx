import React, { useState } from "react";
import axios from "axios";

const FetchLICBill = () => {
  const [formData, setFormData] = useState({
    canumber: "",
    ad1: "",
    ad2: "",
    mode: "", // User selects "Offline"
  });

  const [billData, setBillData] = useState(null);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const fetchBill = async () => {
    console.log("Sending Form Data:", formData);

    try {
        const response = await axios.post(
            "https://sit.paysprint.in/service-api/api/v1/service/bill-payment/bill/fetchlicbill",
            formData,
            {
                headers: {
                    Authorisedkey: "Y2RkZTc2ZmNjODgxODljMjkyN2ViOTlhM2FiZmYyM2I=",
                    Token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0aW1lc3RhbXAiOjE3NDAwMjk5NjEsInBhcnRuZXJJZCI6IlBTMDAxNTY4IiwicmVxaWQiOiIxNzQwMDI5OTYxIn0.FinP5ONFH5_lPJ6wPlHsYN1EjEsI1RuXM0IqlGvokHU",
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
            }
        );

        console.log("Received Bill Data:", response.data);
        setBillData(response.data);

        if (response.data.status) {
            const billPayload = {
                ...formData,  // Include form input data
                ...response.data, // Include fetched bill details
                bill_fetch: response.data.bill_fetch || {} // Ensure nested bill_fetch exists
            };

            console.log("Saving to DB:", billPayload);
            saveBillToDB(billPayload);
        } else {
            alert("Bill fetch failed: " + response.data.message);
        }
    } catch (error) {
        console.error("Error fetching bill:", error);
    }
};

  console.log(billData)

  const saveBillToDB = async (billData) => {
    try {
      const response = await axios.post("/save-bill", billData, {
        headers: { "Content-Type": "application/json" },
      });

      if (response.data.success) {
        alert("Bill saved successfully!");
      } else {
        alert("Failed to save bill.");
      }
    } catch (error) {
      console.error("Error saving bill:", error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchBill();
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-5 bg-white rounded shadow-md">
      <h2 className="text-xl font-bold mb-4">Fetch LIC Bill</h2>
      <form onSubmit={handleSubmit}>
        <label className="block mb-2">
          Consumer Number:
          <input
            type="text"
            name="canumber"
            value={formData.canumber}
            onChange={handleChange}
            className="w-full p-2 border rounded mt-1"
            required
          />
        </label>

        <label className="block mb-2">
          Email:
          <input
            type="email"
            name="ad1"
            value={formData.ad1}
            onChange={handleChange}
            className="w-full p-2 border rounded mt-1"
            required
          />
        </label>

        <label className="block mb-2">
          Date:
          <input
            type="date"
            name="ad2"
            value={formData.ad2}
            onChange={handleChange}
            className="w-full p-2 border rounded mt-1"
            required
          />
        </label>

        <label className="block mb-2">
          Mode:
          <select
            name="mode"
            value={formData.mode}
            onChange={handleChange}
            className="w-full p-2 border rounded mt-1"
            required
          >
            <option value="">Select Mode</option>
            <option value="offline">Offline</option>
            <option value="online">Online</option>
          </select>
        </label>

        {error && <p className="text-red-500">{error}</p>}

        <button
          type="submit"
          className="w-full mt-3 bg-blue-500 text-white p-2 rounded"
        >
          Fetch Bill
        </button>
      </form>

      {billData && (
        <div className="mt-5 p-4 bg-gray-100 rounded">
          <h3 className="font-bold">Bill Details:</h3>
          <p><strong>Response Code:</strong> {billData.response_code}</p>
          <p><strong>Status:</strong> {billData.status ? "Success" : "Failed"}</p>
          <p><strong>Message:</strong> {billData.message}</p>
          <p><strong>Name:</strong> {billData.name || billData.bill_fetch?.userName}</p>
          <p><strong>Bill Amount:</strong> {billData.amount || billData.bill_fetch?.billAmount}</p>
          <p><strong>Net Bill Amount:</strong> {billData.bill_fetch?.billnetamount}</p>
          <p><strong>Due Date:</strong> {billData.duedate || billData.bill_fetch?.dueDate}</p>
          <p><strong>Max Bill Amount:</strong> {billData.bill_fetch?.maxBillAmount}</p>
          <p><strong>Cell Number:</strong> {billData.bill_fetch?.cellNumber}</p>
          <p><strong>Accept Payment:</strong> {billData.bill_fetch?.acceptPayment ? "Yes" : "No"}</p>
          <p><strong>Accept Partial Payment:</strong> {billData.bill_fetch?.acceptPartPay ? "Yes" : "No"}</p>
          <p><strong>Additional Data 2 (ad2):</strong> {billData.ad2 || "N/A"}</p>
          <p><strong>Additional Data 3 (ad3):</strong> {billData.ad3 || "N/A"}</p>
        </div>
      )}
    </div>
  );
};

export default FetchLICBill;
