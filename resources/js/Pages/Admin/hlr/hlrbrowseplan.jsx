import { useForm } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";
import { Loader2 } from "lucide-react";

export default function HlrBrowsePlan({ success, response, error }) {
    const { data, setData, post, processing } = useForm({
        circle: "",
        op: "",
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route("hlrbrowseplan"));
    };

    return (
        <AdminLayout>
            <div className="max-w-3xl mx-auto py-10">
                <div className="shadow-lg p-5 bg-white rounded-lg">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                        Browse HLR Plans
                    </h2>

                    {error && <p className="text-red-500 mb-4">{error}</p>}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label 
                                htmlFor="circle" 
                                className="block text-sm font-medium text-gray-700"
                            >
                                Circle
                            </label>
                            <input
                                id="circle"
                                name="circle"
                                value={data.circle}
                                onChange={(e) => setData("circle", e.target.value)}
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div className="space-y-2">
                            <label 
                                htmlFor="op" 
                                className="block text-sm font-medium text-gray-700"
                            >
                                Operator
                            </label>
                            <input
                                id="op"
                                name="op"
                                value={data.op}
                                onChange={(e) => setData("op", e.target.value)}
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <button
                            type="submit"
                            className={`w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                                processing ? "opacity-75 cursor-not-allowed" : ""
                            }`}
                            disabled={processing}
                        >
                            {processing ? (
                                <Loader2 className="animate-spin h-5 w-5 mx-auto" />
                            ) : (
                                "Fetch Plans"
                            )}
                        </button>
                    </form>

                    {success && response?.data && (
                        <div className="mt-6">
                            <h3 className="text-xl font-semibold mb-3">
                                Plan Results
                            </h3>
                            <ul className="space-y-3">
                                {response.data.map((plan, index) => (
                                    <li
                                        key={index}
                                        className="p-4 border rounded-lg bg-gray-50"
                                    >
                                        <p className="text-gray-700">
                                            <strong>Plan:</strong> {plan.amount} INR
                                        </p>
                                        <p className="text-gray-600">
                                            <strong>Validity:</strong> {plan.validity}
                                        </p>
                                        <p className="text-gray-500">
                                            <strong>Details:</strong> {plan.details}
                                        </p>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}