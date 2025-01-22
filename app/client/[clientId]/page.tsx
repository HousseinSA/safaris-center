"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import AddClientForm from "@/components/AddClientForm";
import toast from "react-hot-toast";

import { Client, } from '@/lib/types'


export default function EditClientPage() {
  const router = useRouter();
  const params = useParams();
  const clientId = params.clientId as string;

  const [client, setClient] = useState<Client | null>(null);

  useEffect(() => {
    const fetchClient = async () => {
      try {
        const response = await fetch(`/api/clients?id=${clientId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch client.");
        }
        const data = await response.json();

        if (!data) {
          throw new Error("Client non trouvé.");
        }

        setClient(data);
      } catch (error) {
        console.error("Error fetching client:", error);
        toast.error("Client non trouvé.");
      } finally {
      }
    };

    if (clientId) {
      fetchClient();
    }
  }, [clientId, router]);

  const handleSave = async (updatedClient: Client) => {
    try {

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { _id, ...clientData } = updatedClient;
      const response = await fetch(`/api/clients`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ _id: clientId, ...clientData }), // Explicitly set _id and spread the rest
      });

      if (!response.ok) {
        throw new Error("Échec de la mise à jour du client.");
      }

      toast.success("Client modifié avec succès!");
      router.push("/");
    } catch (error) {
      console.error("Error saving client:", error);
      toast.error("Échec de la mise à jour du client.");
    } finally {
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4 text-primary">Modifier le client</h2>
      {client && <AddClientForm client={client} onSave={handleSave} />}
    </div>
  );
}