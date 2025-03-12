import React, { useEffect } from "react";
import AdminLayout from "@/Layouts/AdminLayout";

const AirtelTransactionEnquiry = () => {
  useEffect(() => {
    console.log("hii");
  }, []);

  return (
    <AdminLayout>
      <div>Airtel Transaction Enquiry</div>
    </AdminLayout>
  );
};

export default AirtelTransactionEnquiry;
