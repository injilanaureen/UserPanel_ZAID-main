import { useForm } from "@inertiajs/react";
import { useState } from "react";

export default function FinoForm() {
  const { data, setData, post, processing, errors } = useForm({
    transaction_id: "",
    redirect_url: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    post(route("fino.post"), {
      preserveScroll: true,
      preserveState: true,
      onSuccess: (page) => {
        console.log("✅ API Response:", page.props); // Log the API response
      },
      onError: (errors) => console.log("❌ API Errors:", errors),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block">Transaction ID</label>
        <input
          type="number"
          value={data.transaction_id}
          onChange={(e) => setData("transaction_id", e.target.value)}
          className="border p-2 w-full"
        />
        {errors.transaction_id && <div className="text-red-500">{errors.transaction_id}</div>}
      </div>

      <div>
        <label className="block">Redirect URL</label>
        <input
          type="url"
          value={data.redirect_url}
          onChange={(e) => setData("redirect_url", e.target.value)}
          className="border p-2 w-full"
        />
        {errors.redirect_url && <div className="text-red-500">{errors.redirect_url}</div>}
      </div>

      <button type="submit" className="bg-blue-500 text-white px-4 py-2" disabled={processing}>
        {processing ? "Processing..." : "Submit"}
      </button>
    </form>
  );
}
