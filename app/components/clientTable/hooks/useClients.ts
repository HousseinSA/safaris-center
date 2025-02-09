import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Client } from "@/lib/types";
import { showToast } from "@/lib/showToast";

export const useClient = () => {
    const router = useRouter();
    const [clients, setClients] = useState<Client[]>([]);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editedClient, setEditedClient] = useState<Client | null>(null);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [loading, setLoading] = useState(false);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedClient, setSelectedClient] = useState<Client | null>(null);
    const [showInvoice, setShowInvoice] = useState(false);
    const clientsPerPage = 20;

    // Fetch clients
    const fetchClients = async () => {
        setLoading(true);
        try {
            const response = await fetch("/api/clients");
            const data = await response.json();
            setClients(data);
        } catch (error) {
            console.error("Error fetching clients:", error);
            showToast("error", "Échec de la récupération des clients");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchClients();
    }, []);

    // Pagination logic
    const indexOfLastClient = currentPage * clientsPerPage;
    const indexOfFirstClient = indexOfLastClient - clientsPerPage;
    const currentClients = clients.slice(indexOfFirstClient, indexOfLastClient);

    // Group clients by month and year
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
                showToast("success", "Client mis à jour avec succès!");
                fetchClients();
                setEditingId(null);
                setEditedClient(null);
            } else {
                showToast("error", data.error || "Échec de la mise à jour du client");
            }
        } catch (error) {
            console.error("Error updating client:", error);
            showToast("error", "Échec de la mise à jour du client");
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
                showToast("success", "Client supprimé avec succès !");
                fetchClients();
            } else {
                showToast("error", "Échec de la suppression du client");
            }
        } catch (error) {
            console.error("Error deleting client:", error);
            showToast("error", "Échec de la suppression du client");
        } finally {
            setDeletingId(null);
            setIsModalOpen(false);
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
                showToast("error", "Échec de la récupération des données du client");
            }
        } catch (error) {
            console.error("Error fetching client data:", error);
            showToast("error", "Échec de la récupération des données du client");
        }
    };

    // Handle delete click
    const handleDeleteClick = (id: string) => {
        setDeletingId(id);
        setIsModalOpen(true);
    };

    // Handle cancel delete
    const handleCancelDelete = () => {
        setDeletingId(null);
        setIsModalOpen(false);
    };

    return {
        clients,
        groupedClients,
        editingId,
        editedClient,
        loading,
        deletingId,
        isModalOpen,
        selectedClient,
        showInvoice,
        currentPage,
        totalPages,
        indexOfFirstClient,
        indexOfLastClient,
        handleEdit,
        handleSave,
        handleDelete,
        handleEditClientPage,
        handleCheckout,
        handleDeleteClick,
        handleCancelDelete,
        handleNextPage,
        handlePreviousPage,
        setEditedClient,
        setShowInvoice,
        clientsPerPage

    };
};