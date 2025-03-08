import { useState } from "react";
import axios from "axios";
import CheckTransaction from "./getairteltransaction";
import AirtelGenarateURL from "./generateairtelurl";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import AdminLayout from "@/Layouts/AdminLayout";


export default function AirtelForm() {

  return (
    
<AdminLayout>
  <Tabs defaultValue="pay" className="w-full">
    <TabsList className="flex gap-x-72 bg-gradient-to-r from-gray-200 to-black p-8 rounded-lg">
      <TabsTrigger value="url" className="px-6 py-4 text-2xl font-medium text-white">
        Make Payment
      </TabsTrigger>
      <TabsTrigger value="fetch" className="px-6 py-4 text-2xl font-medium text-white">
        Transaction Enquiry
      </TabsTrigger>
    </TabsList>
    <div className="p-4 bg-white rounded-lg mt-2 shadow-lg">
      <TabsContent value="url">
        <AirtelGenarateURL />
      </TabsContent>
      <TabsContent value="fetch">
        <CheckTransaction />
      </TabsContent>
    </div>
  </Tabs>
</AdminLayout>

);
}
