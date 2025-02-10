"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import AddClientForm from "@/app/components/clientForm/AddClientForm";
import { showToast } from "@/lib/showToast";

import { Client, } from '@/lib/types'
import { Button } from "@/components/ui/button";
import { Users } from "lucide-react";
import Link from "next/link";


export default function EditClientPage() {
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
        showToast('error', "Client non trouvé.");
      } finally {
      }
    };

    if (clientId) {
      fetchClient();
    }
  }, [clientId]);

  const handleSave = async (updatedClient: Client) => {
    try {
      const response = await fetch(`/api/clients`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ _id: clientId, ...updatedClient }),
      });

      if (!response.ok) {
        throw new Error("Échec de la mise à jour du client.");
      }

    } catch (error) {
      console.error("Error saving client:", error);
      showToast("error", "Échec de la mise à jour du client.");
    }
  };
  return (
    <div >
      <div className="flex justify-between mb-4 items-center">
        <h2 className="text-xl font-bold  text-primary">Modifier client {client?.name}</h2>
        <Link href={'/'}>
          <Button
            className="bg-primary text-white hover:bg-primary-dark flex items-center space-x-2"
          >
            <Users className="h-4 w-4" />
            <span className="hidden md:inline-block" >Retour à la liste des clients</span>
          </Button>
        </Link >
      </div>
      {client && <AddClientForm client={client} onSave={handleSave} />}
    </div>
  );
}