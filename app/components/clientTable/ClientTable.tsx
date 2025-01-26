"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Client } from "@/lib/types";
import { ClientTableBody } from "./ClientTableBody";
import { Pagination } from "./Pagination";
import { InvoiceModal } from "./InvoiceModal";

export default function ClientTable() {
  const router = useRouter();
  const [clients, setClients] = useState<Client[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editedClient, setEditedClient] = useState<Client | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [showInvoice, setShowInvoice] = useState(false);
  const clientsPerPage = 15;

  // Fetch clients from the API
  const fetchClients = async () => {
    const response = await fetch("/api/clients");
    const data = await response.json();
    setClients(data);
  };

  useEffect(() => {
    fetchClients();
  }, []);

  // Pagination logic
  const indexOfLastClient = currentPage * clientsPerPage;
  const indexOfFirstClient = indexOfLastClient - clientsPerPage;
  const currentClients = clients.slice(indexOfFirstClient, indexOfLastClient);

  // Group the sliced clients by month and year
  const groupedClients = currentClients.reduce((acc: { [key: string]: Client[] }, client) => {
    const date = new Date(client.dateOfBooking);
    const monthYear = `${date.toLocaleString("fr-FR", { month: "long" })} ${date.getFullYear()}`;
    if (!acc[monthYear]) {
      acc[monthYear] = [];
    }
    acc[monthYear].push(client);
    return acc;
  }, {});

  // Total pages
  const totalPages = Math.ceil(clients.length / clientsPerPage);

  // Handle next page
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Handle previous page
  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Save edited client
  const handleSave = async (clientId: string) => {
    try {
      setLoading(true);

      if (!editedClient) return;

      const updatedClient = {
        _id: clientId,
        ...editedClient,
      };

      const response = await fetch("/api/clients", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedClient),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Client mis à jour avec succès !");
        await fetchClients();
        setEditingId(null);
        setEditedClient(null);
      } else {
        toast.error(data.error || "Échec de la mise à jour du client");
      }
    } catch (error) {
      console.error("Error updating client:", error);
      toast.error("Échec de la mise à jour du client");
    } finally {
      setLoading(false);
    }
  };

  // Handle edit mode
  const handleEdit = (client: Client | null) => {
    if (client === null) {
      setEditingId(null);
      setEditedClient(null);
      return;
    }

    if (client._id) {
      setEditingId(client._id.toString());
    }
    setEditedClient(client);
  };

  // Handle delete client
  const handleDelete = async (id: string) => {
    try {
      setDeletingId(id);
      const response = await fetch("/api/clients", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      if (response.ok) {
        toast.success("Client supprimé avec succès !");
        await fetchClients();
      } else {
        toast.error("Échec de la suppression du client");
      }
    } catch (error) {
      console.error("Error deleting client:", error);
      toast.error("Échec de la suppression du client");
    } finally {
      setDeletingId(null);
    }
  };

  // Navigate to edit client page
  const handleEditClientPage = (clientId: string) => {
    router.push(`/client/${clientId}`);
  };

  // Handle checkout (show invoice)
  const handleCheckout = async (clientId: string) => {
    try {
      const response = await fetch(`/api/clients?id=${clientId}`);
      const data = await response.json();
      if (response.ok) {
        setSelectedClient(data);
        setShowInvoice(true);
      } else {
        toast.error("Failed to fetch client data");
      }
    } catch (error) {
      console.error("Error fetching client data:", error);
      toast.error("Failed to fetch client data");
    }
  };

  return (
    <div className="mt-8">
      <h2 className="text-xl font-bold mb-4 text-primary">Liste des clients</h2>

      {clients.length > 0 ? (
        <div className="w-full overflow-x-auto">
          <ClientTableBody
            groupedClients={groupedClients}
            editingId={editingId}
            editedClient={editedClient}
            loading={loading}
            deletingId={deletingId}
            onEdit={handleEdit}
            onSave={handleSave}
            onDelete={handleDelete}
            onEditClientPage={handleEditClientPage}
            onCheckout={handleCheckout}
            setEditedClient={setEditedClient}
          />

          {clients.length > clientsPerPage && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              indexOfFirstClient={indexOfFirstClient}
              indexOfLastClient={indexOfLastClient}
              clientsLength={clients.length}
              onNextPage={handleNextPage}
              onPreviousPage={handlePreviousPage}
            />
          )}
        </div>
      ) : (
        <p className="text-gray-500">Aucun client trouvé.</p>
      )}

      {showInvoice && selectedClient && (
        <InvoiceModal selectedClient={selectedClient} onClose={() => setShowInvoice(false)} />
      )}
    </div>
  );
}