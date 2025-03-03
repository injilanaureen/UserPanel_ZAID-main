import { useState } from "react";
import axios from "axios";
import AdminLayout from "@/Layouts/AdminLayout";


export default function PennyDropForm() {
    const [formData, setFormData] = useState({
        mobile: "",
        accno: "",
        bankid: "",
        benename: "",
        referenceid: "",
        pincode: "",
        address: "",
        dob: "",
        gst_state: "",
        bene_id: ""
    });
    
    const [responseData, setResponseData] = useState(null);
    
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("/penny-drop", formData);
            setResponseData(response.data);
            console.log(response.data)
        } catch (error) {
            console.error("Error processing transaction", error);
        }
    };
    
    return (
          <AdminLayout>
      
        <div className="p-4">
            <h2 className="text-xl font-bold mb-4">Penny Drop Verification</h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
                {Object.keys(formData).map((key) => (
                    <input
                        key={key}
                        type="text"
                        name={key}
                        placeholder={key.replace("_", " ").toUpperCase()}
                        value={formData[key]}
                        onChange={handleChange}
                        className="border p-2 rounded"
                    />
                ))}
                <button type="submit" className="col-span-2 bg-blue-600 text-white p-2 rounded">Submit</button>
            </form>
            
            {responseData && (
                <div className="mt-4">
                    <h3 className="text-lg font-bold">Transaction Response</h3>
                    <table className="border-collapse border border-gray-400 mt-2 w-full">
                        <thead>
                            <tr className="bg-gray-200">
                                {Object.keys(responseData).map((key) => (
                                    <th key={key} className="border p-2">{key.toUpperCase()}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                {Object.values(responseData).map((value, index) => (
                                    <td key={index} className="border p-2">{value}</td>
                                ))}
                            </tr>
                        </tbody>
                    </table>
                </div>
            )}
        </div>
            </AdminLayout>
        
    );
}
