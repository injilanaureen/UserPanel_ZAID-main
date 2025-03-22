import AdminLayout from "../Layouts/AdminLayout";
import { useForm } from "@inertiajs/react";

export default function AddAccount() {
    const { data, setData, post, processing, errors } = useForm({
        bank: "",
        account_name: "",
        account_number: "",
        confirm_account_number: "",
        ifsc_code: "",
    });

    const submit = (e) => {
        e.preventDefault();
        post("/add-account");
    };

    return (
        <AdminLayout>
            <div className="flex justify-between items-center mb-6">
                <div className="text-gray-500">Account List</div>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-sm">
                <form onSubmit={submit}>
                    <div className="grid grid-cols-2 gap-6 mb-6">
                        <div>
                            <label className="block text-gray-500 mb-2">Select Bank</label>
                            <select
                                value={data.bank}
                                onChange={(e) => setData("bank", e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded text-gray-400"
                                required
                            >
                                <option value="">Please select Bank...</option>
                                <option value="bank1">Bank 1</option>
                                <option value="bank2">Bank 2</option>
                                {/* Add more banks as needed */}
                            </select>
                            {errors.bank && <p className="text-red-500 text-sm">{errors.bank}</p>}
                        </div>

                        <div>
                            <label className="block text-gray-500 mb-2">Name on Account</label>
                            <input
                                type="text"
                                placeholder="Enter Name as on Account"
                                value={data.account_name}
                                onChange={(e) => setData("account_name", e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded"
                                required
                            />
                            {errors.account_name && <p className="text-red-500 text-sm">{errors.account_name}</p>}
                        </div>

                        <div>
                            <label className="block text-gray-500 mb-2">Account Number</label>
                            <input
                                type="text"
                                placeholder="Enter Account Number"
                                value={data.account_number}
                                onChange={(e) => setData("account_number", e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded"
                                required
                            />
                            {errors.account_number && <p className="text-red-500 text-sm">{errors.account_number}</p>}
                        </div>

                        <div>
                            <label className="block text-gray-500 mb-2">Confirm Account Number</label>
                            <input
                                type="text"
                                placeholder="Enter Confirm Account Number"
                                value={data.confirm_account_number}
                                onChange={(e) => setData("confirm_account_number", e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded"
                                required
                            />
                            {errors.confirm_account_number && <p className="text-red-500 text-sm">{errors.confirm_account_number}</p>}
                        </div>

                        <div>
                            <label className="block text-gray-500 mb-2">IFSC Code</label>
                            <input
                                type="text"
                                placeholder="Enter IFSC Code"
                                value={data.ifsc_code}
                                onChange={(e) => setData("ifsc_code", e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded"
                                required
                            />
                            {errors.ifsc_code && <p className="text-red-500 text-sm">{errors.ifsc_code}</p>}
                        </div>
                    </div>

                    <div className="flex justify-end">
                        <button
                            type="submit"
                            disabled={processing}
                            className="px-5 py-2 bg-pink-500 text-white rounded hover:bg-pink-600"
                        >
                            Submit
                        </button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}