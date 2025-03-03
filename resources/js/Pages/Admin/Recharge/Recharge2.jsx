import React, { useState } from "react";
import AdminLayout from '@/Layouts/AdminLayout';

const RechargeStatusEnquiry = () => {
  const [referenceId, setReferenceId] = useState("");
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchRechargeStatus = async () => {
    setLoading(true);
    setError(null);
    setResponse(null);

    try {
      const res = await fetch(
        "https://sit.paysprint.in/service-api/api/v1/service/recharge/recharge/status",
        {
          method: "POST",
          headers: {
            "Authorisedkey": "Y2RkZTc2ZmNjODgxODljMjkyN2ViOTlhM2FiZmYyM2I=",
            "Token":
              "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0aW1lc3RhbXAiOjE3Mzg5MjE3NzcsInBhcnRuZXJJZCI6IlBTMDAxNTY4IiwicmVxaWQiOiIxNzM4OTIxNzc3In0.6vhPb1SE1p3yvAaK_GAEz-Y0Ai1ibCbN85adKW_1Xzg",
            "accept": "application/json",
            "content-type": "application/json",
          },
          body: JSON.stringify({ referenceid: referenceId }),
        }
      );

      const data = await res.json();
      setResponse(data);
    } catch (err) {
      setError("Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="p-4 max-w-full mx-auto border rounded shadow-md">
        <h2 className="text-xl font-semibold mb-2">Recharge Status</h2>
        <input
          type="text"
          placeholder="Enter Reference ID"
          value={referenceId}
          onChange={(e) => setReferenceId(e.target.value)}
          className="border p-2 rounded w-full mb-2"
        />
        <button
          onClick={fetchRechargeStatus}
          className="bg-blue-500 text-white p-2 rounded w-full hover:bg-blue-600 transition duration-300"
        >
          Fetch Status
        </button>

        {loading && <p className="mt-2 text-blue-500">Loading...</p>}
        {error && <p className="mt-2 text-red-500">{error}</p>}
        {response && (
          <div className="mt-4 p-4 border rounded bg-white shadow-sm">
            <h3 className="font-semibold text-lg mb-4">Response Details:</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 border-b">Field</th>
                    <th className="px-4 py-2 border-b">Value</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="px-4 py-2 border-b"><strong>Status</strong></td>
                    <td className="px-4 py-2 border-b">{response.status}</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 border-b"><strong>Message</strong></td>
                    <td className="px-4 py-2 border-b">{response.message}</td>
                  </tr>
                  {response.data && (
                    <>
                      <tr>
                        <td className="px-4 py-2 border-b"><strong>Txn ID</strong></td>
                        <td className="px-4 py-2 border-b">{response.data.txnid}</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-2 border-b"><strong>Operator Name</strong></td>
                        <td className="px-4 py-2 border-b">{response.data.operatorname}</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-2 border-b"><strong>Amount</strong></td>
                        <td className="px-4 py-2 border-b">{response.data.amount}</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-2 border-b"><strong>Commission</strong></td>
                        <td className="px-4 py-2 border-b">{response.data.comm}</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-2 border-b"><strong>Status</strong></td>
                        <td className="px-4 py-2 border-b">{response.data.status}</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-2 border-b"><strong>Ref ID</strong></td>
                        <td className="px-4 py-2 border-b">{response.data.refid}</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-2 border-b"><strong>Operator ID</strong></td>
                        <td className="px-4 py-2 border-b">{response.data.operatorid}</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-2 border-b"><strong>Date Added</strong></td>
                        <td className="px-4 py-2 border-b">{response.data.dateadded}</td>
                      </tr>
                    </>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default RechargeStatusEnquiry;