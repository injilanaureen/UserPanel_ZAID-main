import React, { useEffect } from "react";
import { useForm } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";
import { usePage } from "@inertiajs/react";

const TransactionOTP = () => {
  const { props } = usePage();
  const { success, error, transaction, formData, errors: serverErrors } = props;

  const { data, setData, post, processing, errors, reset } = useForm({
    mobile: formData?.mobile || "",
    referenceid: formData?.referenceid || "",
    bene_id: formData?.bene_id || "",
    txntype: formData?.txntype || "",
    dob: formData?.dob || "",
    amount: formData?.amount || "",
    pincode: formData?.pincode || "",
    address: formData?.address || "",
    gst_state: formData?.gst_state || "",
    lat: formData?.lat || "",
    long: formData?.long || "",
  
  });

  // Effect to display flash messages
  useEffect(() => {
    // You can implement a toast notification system here
    if (success) {
      console.log("Success:", success);
      // You could use a library like react-toastify here
      // toast.success(success);
    }
    
    if (error) {
      console.log("Error:", error);
      // toast.error(error);
    }
  }, [success, error]);

  const handleChange = (e) => {
    setData(e.target.name, e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    try {
      post(route("register.processtransaction1OTP"));

    } catch (error) {
        console.error("Error processing transaction", error);
    }
  };

  return (
    <AdminLayout>
      <div className="p-4">
        <h1 className="text-xl font-bold">Transaction Send OTP</h1>
        
        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            {success}
          </div>
        )}
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        {transaction && (
          <div className="mb-4">
            <h2 className="text-lg font-semibold">Transaction Details</h2>
            <div className="bg-gray-100 p-4 rounded">
              <p><strong>Reference ID:</strong> {transaction.referenceid}</p>
              <p><strong>Beneficiary:</strong> {transaction.benename}</p>
              <p><strong>Status:</strong> {transaction.response_code === 1 ? "Success" : "Failed"}</p>
              <p><strong>message:</strong> {transaction.message}</p>
            </div>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="mt-4 space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Basic Information */}
            <div>
              <label className="block font-semibold">Mobile</label>
              <input
                type="text"
                name="mobile"
                value={data.mobile}
                onChange={handleChange}
                placeholder="9999999999"
                className="border p-2 w-full rounded"
              />
              {errors.mobile && <p className="text-red-500">{errors.mobile}</p>}
            </div>
            
            <div>
              <label className="block font-semibold">Reference ID</label>
              <input
                type="text"
                name="referenceid"
                value={data.referenceid}
                onChange={handleChange}
                placeholder="12345677"
                className="border p-2 w-full rounded"
              />
              {errors.referenceid && <p className="text-red-500">{errors.referenceid}</p>}
            </div>
            
            <div>
              <label className="block font-semibold">Beneficiary ID</label>
              <input
                type="text"
                name="bene_id"
                value={data.bene_id}
                onChange={handleChange}
                placeholder="1234"
                className="border p-2 w-full rounded"
              />
              {errors.bene_id && <p className="text-red-500">{errors.bene_id}</p>}
            </div>
            
            <div>
              <label className="block font-semibold">Transaction Type</label>
              <select
                name="txntype"
                value={data.txntype}
                onChange={handleChange}
                className="border p-2 w-full rounded"
              >
                <option value="">Select transaction type</option>
                <option value="IMPS">IMPS</option>
                <option value="NEFT">NEFT</option>
              </select>
              {errors.txntype && <p className="text-red-500">{errors.txntype}</p>}
            </div>
            
            <div>
              <label className="block font-semibold">Date of Birth</label>
              <input
                type="date"
                name="dob"
                value={data.dob}
                onChange={handleChange}
                className="border p-2 w-full rounded"
              />
              {errors.dob && <p className="text-red-500">{errors.dob}</p>}
            </div>
            
            {/* New fields */}
            <div>
              <label className="block font-semibold">Amount</label>
              <input
                type="text"
                name="amount"
                value={data.amount}
                onChange={handleChange}
                placeholder="Enter amount"
                className="border p-2 w-full rounded"
              />
              {errors.amount && <p className="text-red-500">{errors.amount}</p>}
            </div>
            
            <div>
              <label className="block font-semibold">Pincode</label>
              <input
                type="text"
                name="pincode"
                value={data.pincode}
                onChange={handleChange}
                placeholder="Enter pincode"
                className="border p-2 w-full rounded"
              />
              {errors.pincode && <p className="text-red-500">{errors.pincode}</p>}
            </div>
            
            <div>
              <label className="block font-semibold">Address</label>
              <input
                type="text"
                name="address"
                value={data.address}
                onChange={handleChange}
                placeholder="Enter address"
                className="border p-2 w-full rounded"
              />
              {errors.address && <p className="text-red-500">{errors.address}</p>}
            </div>
            
            <div>
              <label className="block font-semibold">GST State</label>
              <input
                type="text"
                name="gst_state"
                value={data.gst_state}
                onChange={handleChange}
                placeholder="Enter GST state"
                className="border p-2 w-full rounded"
              />
              {errors.gst_state && <p className="text-red-500">{errors.gst_state}</p>}
            </div>
            
            <div>
              <label className="block font-semibold">Latitude</label>
              <input
                type="text"
                name="lat"
                value={data.lat}
                onChange={handleChange}
                placeholder="Latitude"
                className="border p-2 w-full rounded"
              />
              {errors.lat && <p className="text-red-500">{errors.lat}</p>}
            </div>
            
            <div>
              <label className="block font-semibold">Longitude</label>
              <input
                type="text"
                name="long"
                value={data.long}
                onChange={handleChange}
                placeholder="Longitude"
                className="border p-2 w-full rounded"
              />
              {errors.long && <p className="text-red-500">{errors.long}</p>}
            </div>

          </div>
          
          <div className="mt-6">
            <button 
              type="submit" 
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600" 
              disabled={processing}
            >
              {processing ? "Processing..." : "Submit Transaction"}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
};

export default TransactionOTP;