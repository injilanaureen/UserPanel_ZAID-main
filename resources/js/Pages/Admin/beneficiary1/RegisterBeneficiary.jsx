import React, { useState, useEffect } from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import { useForm, usePage } from "@inertiajs/react";

const RegisterBeneficiary = () => {
  const { flash, responseData } = usePage().props;
  
  const { data, setData, post, processing, errors, reset } = useForm({
    mobile: "",
    benename: "",
    bankid: "",
    accno: "",
    ifsccode: "",
    verified: "0",
    gst_state: "07",
    dob: "",
    address: "",
    pincode: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
   post(route('store-beneficiary'), {
      preserveScroll: true,
    });

  };

  useEffect(() => {
    if (flash && flash.status === 'success') {
      // Optionally reset the form after successful submission
      // reset();
    }
  }, [flash]);

  return (
    <AdminLayout>
      <h1 className="text-xl font-bold mb-4">Register Beneficiary</h1>
      
      {flash && flash.message && (
        <div className={`p-4 mb-4 rounded ${flash.status === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {flash.message}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4 border p-4 rounded shadow-md">
        <input
          type="text"
          placeholder="Mobile Number"
          value={data.mobile}
          onChange={(e) => setData("mobile", e.target.value)}
          required
          className="border p-2 w-full"
        />
        {errors.mobile && <div className="text-red-500">{errors.mobile}</div>}
        
        <input
          type="text"
          placeholder="Beneficiary Name"
          value={data.benename}
          onChange={(e) => setData("benename", e.target.value)}
          required
          className="border p-2 w-full"
        />
        {errors.benename && <div className="text-red-500">{errors.benename}</div>}
        
        <input
          type="text"
          placeholder="Bank ID"
          value={data.bankid}
          onChange={(e) => setData("bankid", e.target.value)}
          required
          className="border p-2 w-full"
        />
        {errors.bankid && <div className="text-red-500">{errors.bankid}</div>}
        
        <input
          type="text"
          placeholder="Account Number"
          value={data.accno}
          onChange={(e) => setData("accno", e.target.value)}
          required
          className="border p-2 w-full"
        />
        {errors.accno && <div className="text-red-500">{errors.accno}</div>}
        
        <input
          type="text"
          placeholder="IFSC Code"
          value={data.ifsccode}
          onChange={(e) => setData("ifsccode", e.target.value)}
          required
          className="border p-2 w-full"
        />
        {errors.ifsccode && <div className="text-red-500">{errors.ifsccode}</div>}
        
        <input
          type="date"
          placeholder="Date of Birth"
          value={data.dob}
          onChange={(e) => setData("dob", e.target.value)}
          required
          className="border p-2 w-full"
        />
        {errors.dob && <div className="text-red-500">{errors.dob}</div>}
        
        <input
          type="text"
          placeholder="Address"
          value={data.address}
          onChange={(e) => setData("address", e.target.value)}
          required
          className="border p-2 w-full"
        />
        {errors.address && <div className="text-red-500">{errors.address}</div>}
        
        <input
          type="text"
          placeholder="Pincode"
          value={data.pincode}
          onChange={(e) => setData("pincode", e.target.value)}
          required
          className="border p-2 w-full"
        />
        {errors.pincode && <div className="text-red-500">{errors.pincode}</div>}
        
        <button
          type="submit"
          disabled={processing}
          className="bg-blue-500 text-white p-2 rounded w-full hover:bg-blue-600 disabled:bg-blue-300"
        >
          {processing ? 'Processing...' : 'Register Beneficiary'}
        </button>
      </form>

      {/* Show API Response in Table */}
      {responseData && (
  <div className="mt-6">
    <h2 className="text-lg font-semibold mb-2">Response Data</h2>
    <table className="border-collapse w-full border">
      <thead>
        <tr className="bg-gray-200">
          <th className="border p-2">Field</th>
          <th className="border p-2">Value</th>
        </tr>
      </thead>
      <tbody>
        {Object.entries(responseData).map(([key, value]) => (
          <tr key={key}>
            <td className="border p-2">{key}</td>
            <td className="border p-2">{value}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)}

    </AdminLayout>
  );
};

export default RegisterBeneficiary;