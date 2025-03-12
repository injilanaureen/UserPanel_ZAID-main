import AdminLayout from '@/Layouts/AdminLayout';

export default function Test({ apiResponse }) {
  return (
    <AdminLayout>
      <h1>LPG Bill Fetch API Response</h1>
      <pre>{JSON.stringify(apiResponse, null, 2)}</pre>
    </AdminLayout>
  );
}
