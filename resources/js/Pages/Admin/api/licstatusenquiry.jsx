import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

const LICEnquiry = () => {
  const [statusReferenceId, setStatusReferenceId] = useState("");
  const [statusResult, setStatusResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const headers = {
    "Authorisedkey": "Y2RkZTc2ZmNjODgxODljMjkyN2ViOTlhM2FiZmYyM2I=",
    "Token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0aW1lc3RhbXAiOjE3NDAwNTE4MDYsInBhcnRuZXJJZCI6IlBTMDAxNTY4IiwicmVxaWQiOiIxNzQwMDUxODA2In0.fgh6KhbJ3WFbs4EuPoxDC65D0ESLOVYjf_toFvchjvc",
    "Accept": "text/plain",
    "Content-Type": "application/json",
  };

  const checkStatus = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      // Fetch CSRF token from Laravel
      const csrfResponse = await fetch("/get-csrf-token");
      const csrfData = await csrfResponse.json();
      const csrfToken = csrfData.csrf_token;

      // Fetch LIC status from API
      const response = await fetch(
        "https://sit.paysprint.in/service-api/api/v1/service/bill-payment/bill/licstatus",
        {
          method: "POST",
          headers,
          body: JSON.stringify({ referenceid: statusReferenceId }),
        }
      );

      const data = await response.json();
      console.log("API Response:", data.data);
      setStatusResult(data);

      if (data.status) {
        // Save response data to Laravel
        const saveResponse = await fetch("/save-lic-status", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-CSRF-TOKEN": csrfToken,
          },
          body: JSON.stringify(data.data),
        });

        if (!saveResponse.ok) {
          throw new Error("Failed to save data to the backend");
        }

        console.log("Data saved successfully");
      } else {
        setMessage({ type: "error", text: data.message });
      }
    } catch (error) {
      console.error("Error in checkStatus:", error);
      setMessage({ type: "error", text: "An error occurred while processing the request" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardContent className="p-6">
        <form onSubmit={checkStatus} className="space-y-4">
          <Input
            type="text"
            placeholder="Reference ID"
            value={statusReferenceId}
            onChange={(e) => setStatusReferenceId(e.target.value)}
            required
            className="w-full"
          />

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Check Status"}
          </Button>
        </form>

        {message && (
          <div className={`mt-4 p-3 rounded-md ${message.type === "error" ? "bg-red-100 text-red-600" : "bg-green-100 text-green-600"}`}>
            {message.text}
          </div>
        )}

        {statusResult && statusResult.status && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-medium mb-2">Transaction Details:</h3>
            <div className="space-y-2 text-sm">
              <p><strong>Txn ID:</strong> {statusResult.data.txnid}</p>
              <p><strong>Operator Name:</strong> {statusResult.data.operatorname}</p>
              <p><strong>CA Number:</strong> {statusResult.data.canumber}</p>
              <p><strong>Amount:</strong> {statusResult.data.amount}</p>
              <p><strong>Commission:</strong> {statusResult.data.comm}</p>
              <p><strong>TDS:</strong> {statusResult.data.tds}</p>
              <p><strong>Status:</strong> {statusResult.data.status === "0" ? "Pending" : "Completed"}</p>
              <p><strong>Reference ID:</strong> {statusResult.data.refid}</p>
              <p><strong>Refunded:</strong> {statusResult.data.refunded === "1" ? "Yes" : "No"}</p>
              <p><strong>Date Added:</strong> {statusResult.data.dateadded}</p>
              {statusResult.data.refunded === "1" && (
                <>
                  <p><strong>Refund Txn ID:</strong> {statusResult.data.refundtxnid}</p>
                  <p><strong>Date Refunded:</strong> {statusResult.data.daterefunded}</p>
                </>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default LICEnquiry;
