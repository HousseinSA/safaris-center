"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import AddClientForm from "@/app/components/clientForm/AddClientForm";
import toast from "react-hot-toast";

import { Client, } from '@/lib/types'
import { Button } from "@/components/ui/button";
import { Users } from "lucide-react";
import Link from "next/link";


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
      const response = await fetch(`/api/clients`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ _id: clientId, ...updatedClient }), // Include _id to identify which client to update
      });

      if (!response.ok) {
        throw new Error("Échec de la mise à jour du client.");
      }

      toast.success("Client modifié avec succès!");
      router.push("/");
    } catch (error) {
      console.error("Error saving client:", error);
      toast.error("Échec de la mise à jour du client.");
    }
  };
  return (
    <div >
      <div className="flex justify-between mb-4 items-center">
        <h2 className="text-xl font-bold  text-primary">Modifier le client</h2>
        <Link href={'/'}>
          <Button
            className="bg-primary text-white hover:bg-primary-dark flex items-center space-x-2"
          >
            <Users className="h-4 w-4" /> {/* Icon */}
            <span className="hidden md:inline-block" >Retour à la liste des clients</span> {/* Button text in French */}
          </Button>
        </Link >
      </div>
      {client && <AddClientForm client={client} onSave={handleSave} />}
    </div>
  );
}