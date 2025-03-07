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
        <TabsList className="flex justify-center bg-primary-color p-2 rounded-lg">
          <TabsTrigger value="url" className="px-6 py-2 text-lg font-medium">Make Payment</TabsTrigger>
          <TabsTrigger value="fetch" className="px-6 py-2 text-lg font-medium">Transaction Enquiry</TabsTrigger>
        </TabsList>
        <div className="p-4 bg-tertiary-color rounded-lg mt-2">
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
