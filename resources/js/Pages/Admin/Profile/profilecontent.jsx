import React from 'react'

export default function PersonalContent() {
    return (
      <div className="p-6">
        <div className="bg-white rounded-md overflow-hidden">
          <div className="bg-gray-900 text-white p-4">
            <h2 className="text-xl">Personal Information</h2>
          </div>
  
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="font-medium">Name</label>
                <input
                  type="text"
                  value="Zaid Maalik"
                  className="w-full p-2 border border-dashed border-gray-300 rounded"
                  readOnly
                />
              </div>
  
              <div className="space-y-2">
                <label className="font-medium">Mobile</label>
                <input
                  type="text"
                  value="Maalik Na Number"
                  className="w-full p-2 border border-dashed border-gray-300 rounded"
                  readOnly
                />
              </div>
  
              <div className="space-y-2">
                <label className="font-medium">Email</label>
                <input
                  type="email"
                  value="zaidiqbaliqbal28@gmail.com"
                  className="w-full p-2 border border-dashed border-gray-300 rounded"
                  readOnly
                />
              </div>
  
              <div className="space-y-2">
                <label className="font-medium">State</label>
                <select className="w-full p-2 border border-gray-300 rounded">
                  <option>Select State</option>
                  <option>Delhi</option>
                  <option>Uttar Pradesh</option>
                  <option>Maharashtra</option>
                </select>
              </div>
  
              <div className="space-y-2">
                <label className="font-medium">City</label>
                <input type="text" value="Noida" className="w-full p-2 border border-dashed border-gray-300 rounded" />
              </div>
  
              <div className="space-y-2">
                <label className="font-medium">Pincode</label>
                <input type="text" value="201301" className="w-full p-2 border border-dashed border-gray-300 rounded" />
              </div>
  
              <div className="space-y-2 col-span-full">
                <label className="font-medium">Address</label>
                <textarea
                  value="Noida"
                  rows={4}
                  className="w-full p-2 border border-dashed border-gray-300 rounded resize-none"
                ></textarea>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
  
  