"use client";

// import { useEffect, useState } from "react";
// import { useRouter, useParams } from "next/navigation";
// import { toast } from "sonner";
// import AddClientForm from "../../components/AddClientForm"; // Adjust the import path

// interface Client {
//   id: number;
//   name: string;
//   services: { name: string; price: number }[];
//   paymentMethod: string;
//   upfrontPayment: number;
//   phoneNumber: string;
//   responsable: string;
//   totalPrice: number;
// }

export default function EditClientPage() {
  // const router = useRouter();
  // const params = useParams();
  // const clientId = Number(params.id); // Get the client ID from the URL

  // const [client, setClient] = useState<Client | null>(null);

  // useEffect(() => {
  //   if (typeof window !== "undefined") {
  //     const clients = JSON.parse(window.localStorage.getItem("clients") || "[]");
  //     const foundClient = clients.find((c: Client) => c.id === clientId);
  //     if (foundClient) {
  //       setClient(foundClient);
  //     } else {
  //       toast.error("Client non trouvé.");
  //       router.push("/"); // Redirect to the homepage if the client is not found
  //     }
  //   }
  // }, [clientId, router]);

  // const handleSave = (updatedClient: Client) => {
  //   if (typeof window !== "undefined") {
  //     const clients = JSON.parse(window.localStorage.getItem("clients") || "[]");
  //     const updatedClients = clients.map((c: Client) =>
  //       c.id === clientId ? updatedClient : c
  //     );
  //     window.localStorage.setItem("clients", JSON.stringify(updatedClients));
  //     toast.success("Client modifié avec succès!");
  //     // router.push("/"); 
  //   }
  // };
  

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Modifier le client</h1>
      {/* <AddClientForm client={client} onSave={handleSave} /> */}
    </div>
  );
}
