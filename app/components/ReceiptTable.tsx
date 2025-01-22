
"use client";

import { Button } from "./ui/button";
import { Download, Printer } from "lucide-react";

interface Client {
  id: number;
  name: string;
  totalPrice: number;
}

export default function ReceiptTable() {
  const clients = JSON.parse(window.localStorage.getItem("clients") || "[]");

  const handleDownload = () => {
    // Implement download logic
    alert("Downloading...");
  };

  const handlePrint = () => {
    // Implement print logic
    window.print();
  };

  return (
    <div className="mt-8">
      <h2 className="text-xl font-bold mb-4">Checkout</h2>
      <table className="w-full border-collapse border">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2 border">Nom du client</th>
            <th className="p-2 border">Total</th>
          </tr>
        </thead>
        <tbody>
          {clients.map((client: Client) => (
            <tr key={client.id} className="hover:bg-gray-100">
              <td className="p-2 border">{client.name}</td>
              <td className="p-2 border">{client.totalPrice} MRO</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mt-4 flex space-x-2">
        <Button onClick={handleDownload}>
          <Download className="h-4 w-4 mr-2" />
          Télécharger
        </Button>
        <Button onClick={handlePrint}>
          <Printer className="h-4 w-4 mr-2" />
          Imprimer
        </Button>
      </div>
    </div>
  );
}