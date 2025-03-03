import React, { useState } from "react";
import { useForm, usePage } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";

const FetchBeneficiary = () => {
  const { beneficiaryData, enteredMobile } = usePage().props;
  const { data, setData, post, processing } = useForm({ mobile: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    post(route("admin.beneficiary.fetch"), {
      onSuccess: () => setSubmitted(true),
    });
  };

  return (
    <AdminLayout>
      <div className="p-6 bg-white shadow-md rounded-lg">
        <h1 className="text-xl font-bold mb-4">Fetch Beneficiary</h1>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="mb-4">
          <label className="block text-gray-700 font-medium">Mobile Number:</label>
          <input
            type="text"
            value={data.mobile}
            onChange={(e) => setData("mobile", e.target.value)}
            required
            className="border rounded p-2 w-full mt-2"
            placeholder="Enter mobile number"
          />
          <button
            type="submit"
            className="mt-3 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            disabled={processing}
          >
            {processing ? "Fetching..." : "Fetch Beneficiary"}
          </button>
        </form>

        {/* Display Response */}
        {submitted && (
          <div className="mt-4">
            <h3 className="text-lg font-semibold">Response for {enteredMobile}:</h3>

            {beneficiaryData?.status && beneficiaryData?.data?.length > 0 ? (
              <>
                <p className="text-green-600 font-medium mb-2">{beneficiaryData.message}</p>

                {/* Beneficiary Table */}
                <div className="overflow-x-auto">
                  <table className="min-w-full border border-gray-300 shadow-md rounded-lg">
                    <thead className="bg-gray-200">
                      <tr>
                        <th className="border px-4 py-2">Beneficiary ID</th>
                        <th className="border px-4 py-2">Bank ID</th>
                        <th className="border px-4 py-2">Bank Name</th>
                        <th className="border px-4 py-2">Account No</th>
                        <th className="border px-4 py-2">IFSC Code</th>
                        <th className="border px-4 py-2">Beneficiary Name</th>
                        <th className="border px-4 py-2">Bank Type</th>
                        <th className="border px-4 py-2">Verified</th>
                      </tr>
                    </thead>
                    <tbody>
                      {beneficiaryData.data.map((item, index) => (
                        <tr key={index} className="hover:bg-gray-100">
                          <td className="border px-4 py-2">{item.bene_id}</td>
                          <td className="border px-4 py-2">{item.bankid}</td>
                          <td className="border px-4 py-2">{item.bankname}</td>
                          <td className="border px-4 py-2">{item.accno}</td>
                          <td className="border px-4 py-2">{item.ifsc}</td>
                          <td className="border px-4 py-2">{item.name}</td>
                          <td className="border px-4 py-2">{item.banktype}</td>
                          <td className="border px-4 py-2">
                            {item.verified === "1" ? (
                              <span className="text-green-500 font-bold">✔ Verified</span>
                            ) : (
                              <span className="text-red-500 font-bold">✘ Not Verified</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            ) : (
              <p className="text-red-500">No beneficiary data found.</p>
            )}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default FetchBeneficiary;
