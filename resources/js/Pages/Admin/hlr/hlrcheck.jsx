import React, { useState } from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import axios from "axios";

const HLRCheck = () => {
    const [number, setNumber] = useState("");
    const [type, setType] = useState("mobile");
    const [response, setResponse] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleCheck = async () => {
        setError(null);
        setResponse(null);
        setLoading(true);
        try {
            const res = await axios.post("/hlrcheck", { number, type });
            setResponse(res.data);
        } catch (err) {
            setError("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <AdminLayout>
            <div className="max-w-md mx-auto bg-white shadow-md rounded-lg p-6">
                <h1 className="text-xl font-bold mb-4 text-center">HLR Check</h1>
                <div className="mb-4">
                    <input 
                        type="text" 
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
                        placeholder="Enter number" 
                        value={number} 
                        onChange={(e) => setNumber(e.target.value)} 
                    />
                </div>
                <div className="mb-4">
                    <select 
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
                        value={type} 
                        onChange={(e) => setType(e.target.value)}>
                        <option value="mobile">Mobile</option>
                        <option value="landline">Landline</option>
                    </select>
                </div>
                <button 
                    onClick={handleCheck} 
                    className="w-full bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-200"
                    disabled={loading}
                >
                    {loading ? "Checking..." : "Check"}
                </button>
                {response && (
                    <pre className="mt-4 p-2 bg-gray-100 border rounded-lg overflow-auto text-sm">
                        {JSON.stringify(response, null, 2)}
                    </pre>
                )}
                {error && <p className="mt-4 text-red-500 text-center">{error}</p>}
            </div>
        </AdminLayout>
    );
};

export default HLRCheck;
