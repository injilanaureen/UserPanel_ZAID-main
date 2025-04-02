// src/pages/Admin/ipwhitelist/ipwhitelist.jsx
import { useState, useEffect } from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import { PlusCircle, Trash2, Save, AlertCircle, CheckCircle } from "lucide-react";
import axios from "axios";
import { usePage } from "@inertiajs/react";

const IPWhitelist = () => {
  const { initialIps } = usePage().props;
  const [ips, setIps] = useState(initialIps || []);
  const [newIp, setNewIp] = useState("");
  const [isValid, setIsValid] = useState(true);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    const checkIP = async () => {
      try {
        const response = await axios.post('/check-ip');
        if (response.data.status === 'success') {
          setMessage({ type: "success", text: `IP ${response.data.ip} approved` });
        } else if (response.data.status === 'pending') {
          setMessage({ type: "warning", text: `IP ${response.data.ip} is pending approval` });
        }
      } catch (error) {
        setMessage({ type: "error", text: error.response.data.message });
      }
    };
    checkIP();
  }, []);

  const validateIp = (ip) => {
    const ipRegex = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    return ipRegex.test(ip);
  };

  const handleInputChange = (e) => {
    setNewIp(e.target.value);
    setIsValid(e.target.value.trim() === "" || validateIp(e.target.value));
  };

  const addIp = () => {
    if (!validateIp(newIp)) {
      setMessage({ type: "error", text: "Invalid IP format" });
      return;
    }
    if (ips.some(ip => ip.address === newIp.trim())) {
      setMessage({ type: "error", text: "IP already exists" });
      return;
    }
    setIps([...ips, { address: newIp.trim(), status: 0 }]);
    setNewIp("");
    setMessage({ type: "success", text: "IP added as pending" });
  };

  const removeIp = (index) => {
    setIps(ips.filter((_, i) => i !== index));
    setMessage({ type: "success", text: "IP removed from list" });
  };

  const deleteIp = async (ipAddress) => {
    try {
      setLoading(true);
      const response = await axios.delete('/whitelist/ip', {
        data: { ip_address: ipAddress }
      });
      
      // Remove the IP from local state if deletion was successful
      setIps(ips.filter(ip => ip.address !== ipAddress));
      setMessage({ 
        type: "success", 
        text: response.data.message 
      });
    } catch (error) {
      setMessage({ 
        type: "error", 
        text: error.response?.data?.message || "Failed to delete IP" 
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleStatus = (index) => {
    const updatedIps = [...ips];
    updatedIps[index].status = updatedIps[index].status === 1 ? 0 : 1;
    setIps(updatedIps);
    setMessage({ 
      type: "success", 
      text: `IP ${updatedIps[index].address} set to ${updatedIps[index].status === 1 ? 'approved' : 'pending'}`
    });
  };

  const saveChanges = async () => {
    setLoading(true);
    try {
      const response = await axios.post('/update-whitelist', { ips });
      setMessage({ type: "success", text: response.data.message });
    } catch (error) {
      setMessage({ type: "error", text: "Failed to update whitelist" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-full bg-white rounded-xl shadow-md border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-tr from-gray-400 to-black py-4 px-6">
          <h2 className="text-3xl font-semibold text-white">IP Whitelist Management</h2>
        </div>

        <div className="p-6">
          {message.text && (
            <div className={`mb-4 p-4 rounded-lg ${
              message.type === "error" ? "bg-red-50 text-red-600" : 
              message.type === "warning" ? "bg-yellow-50 text-yellow-600" : 
              "bg-green-50 text-green-600"
            }`}>
              <div className="flex items-center">
                {message.type === "error" ? <AlertCircle size={16} className="mr-2" /> : <CheckCircle size={16} className="mr-2" />}
                {message.text}
              </div>
            </div>
          )}

          <div className="mb-6">
            <label className="block text-gray-700 font-medium mb-2">IP Addresses</label>
            {ips.length === 0 ? (
              <div className="text-center py-6 bg-gray-50 rounded-md border border-dashed border-gray-300">
                <p className="text-gray-500">No IP addresses in the whitelist</p>
              </div>
            ) : (
              <div className="space-y-2 max-h-64 overflow-y-auto pr-2">
                {ips.map((ip, index) => (
                  <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-md border border-gray-200">
                    <div className="flex items-center">
                      <span className="font-mono text-gray-700 mr-4">{ip.address}</span>
                      <span className={`px-2 py-1 rounded text-sm ${
                        ip.status === 1 ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {ip.status === 1 ? 'Approved' : 'Pending'}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button 
                        className="text-blue-500 hover:text-blue-700 transition"
                        onClick={() => toggleStatus(index)}
                        disabled={loading}
                      >
                        {ip.status === 1 ? 'Set Pending' : 'Approve'}
                      </button>
                      <button 
                        className="text-red-500 hover:text-red-700 transition" 
                        onClick={() => deleteIp(ip.address)}
                        disabled={loading}
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">Add New IP Address</label>
            <div className="flex">
              <input
                type="text"
                className={`flex-1 p-2 border rounded-l-md focus:outline-none focus:ring-2 ${!isValid ? "border-red-500 focus:ring-red-200" : "border-gray-300 focus:ring-gray-500"}`}
                value={newIp}
                onChange={handleInputChange}
                placeholder="e.g., 192.168.1.1"
                disabled={loading}
              />
              <button 
                className="bg-gray-800 text-white px-4 py-2 rounded-r-md hover:bg-black transition disabled:opacity-50" 
                onClick={addIp} 
                disabled={!isValid || newIp.trim() === "" || loading}
              >
                <PlusCircle size={16} className="mr-1" /> Add IP
              </button>
            </div>
          </div>

          <button
            className="w-full bg-gray-800 text-white py-3 px-4 rounded-lg hover:bg-black focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
            onClick={saveChanges}
            disabled={loading}
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </AdminLayout>
  );
};

export default IPWhitelist;