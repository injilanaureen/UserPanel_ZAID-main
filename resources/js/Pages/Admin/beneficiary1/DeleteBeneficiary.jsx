import { useState } from "react";
import { useForm } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";

export default function DeleteBeneficiary() {
    const { data, setData, post, processing, errors } = useForm({
        mobile: "",
        bene_id: "",
    });

    const [modalOpen, setModalOpen] = useState(false);
    const [message, setMessage] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        setModalOpen(true); // Open modal before deletion
    };

    const confirmDelete = () => {
        post(route("beneficiary1.deleteBeneficiary"), {
            onSuccess: (response) => {
                setMessage(response.props.flash.success.message);
                setModalOpen(false);
            },
        });
    };

    return (
          <AdminLayout>
      
        <div className="p-6 bg-white rounded-lg shadow-md max-w-sm mx-auto">
            <h2 className="text-lg font-bold mb-4">Delete Beneficiary</h2>

            {message && <p className="text-green-500">{message}</p>}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium">Mobile Number</label>
                    <input
                        type="text"
                        value={data.mobile}
                        onChange={(e) => setData("mobile", e.target.value)}
                        className="w-full p-2 border rounded"
                        required
                    />
                    {errors.mobile && <p className="text-red-500">{errors.mobile}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium">Beneficiary ID</label>
                    <input
                        type="text"
                        value={data.bene_id}
                        onChange={(e) => setData("bene_id", e.target.value)}
                        className="w-full p-2 border rounded"
                        required
                    />
                    {errors.bene_id && <p className="text-red-500">{errors.bene_id}</p>}
                </div>

                <button
                    type="submit"
                    className="w-full bg-red-500 text-white py-2 rounded hover:bg-red-600"
                >
                    Delete
                </button>
            </form>

            {/* Modal */}
            {modalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg">
                        <h3 className="text-lg font-bold mb-2">Confirm Deletion</h3>
                        <p>Are you sure you want to delete this beneficiary?</p>
                        <div className="flex justify-end mt-4">
                            <button
                                onClick={() => setModalOpen(false)}
                                className="mr-2 bg-gray-300 px-4 py-2 rounded"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmDelete}
                                className="bg-red-500 text-white px-4 py-2 rounded"
                            >
                                Confirm
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
        </AdminLayout>
    );
    
}
