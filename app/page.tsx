// app/page.tsx
import ClientTable from "./components/ClientTable";
import ReceiptTable from "./components/ReceiptTable";

export default function Home() {
  return (
    <div className="space-y-6">
      <ClientTable />
      <ReceiptTable />
    </div>
  );
}