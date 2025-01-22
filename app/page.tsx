import ClientTable from "./components/ClientTable";

export default function Home() {
  return (
    <div className="space-y-6">
      <ClientTable />
      {/* <ReceiptTable /> */}
    </div>
  );
}