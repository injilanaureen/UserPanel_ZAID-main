import React from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import LicBillPay from './licbillpay';
import FetchLICBill from './licfetchbill';
import LICEnquiry from './licstatusenquiry';
import AdminLayout from '@/Layouts/AdminLayout';

export default function Licapi() {
  return (
    <AdminLayout>

    <div className="max-w-2xl mx-auto mt-10 p-6 bg-secondary-color text-text-color rounded-2xl shadow-lg">
      <Tabs defaultValue="pay" className="w-full">
        <TabsList className="flex justify-center bg-primary-color p-2 rounded-lg">
          <TabsTrigger value="pay" className="px-6 py-2 text-lg font-medium">Pay Bill</TabsTrigger>
          <TabsTrigger value="fetch" className="px-6 py-2 text-lg font-medium">Fetch Bill</TabsTrigger>
          <TabsTrigger value="enquiry" className="px-6 py-2 text-lg font-medium">Status Enquiry</TabsTrigger>
        </TabsList>
        <div className="p-4 bg-tertiary-color rounded-lg mt-2">
          <TabsContent value="pay">
            <LicBillPay />
          </TabsContent>
          <TabsContent value="fetch">
            <FetchLICBill />
          </TabsContent>
          <TabsContent value="enquiry">
            <LICEnquiry/>
          </TabsContent>
        </div>
      </Tabs>
      </div>
      
    </AdminLayout>
    );
  }
