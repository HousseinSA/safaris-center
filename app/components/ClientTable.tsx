"use client";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Edit, Trash, Check, X, ChevronLeft, ChevronRight, CheckCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { format } from "date-fns";
import { BeatLoader } from "react-spinners";
import { Client } from "@/lib/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Invoice from "./Invoice";

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

  const fetchClients = async () => {
    const response = await fetch("/api/clients");
    const data = await response.json();
    setClients(data);
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const indexOfLastClient = currentPage * clientsPerPage;
  const indexOfFirstClient = indexOfLastClient - clientsPerPage;
  const currentClients = clients.slice(indexOfFirstClient, indexOfLastClient);

  const totalPages = Math.ceil(clients.length / clientsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

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

  const handleEdit = (client: Client) => {
    if (client._id) {
      setEditingId(client._id.toString());
    }
    setEditedClient(client);
  };

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
      toast.error("Échec de la suppression du client");
    } finally {
      setDeletingId(null);
    }
  };

  const handleEditClientPage = (clientId: string) => {
    router.push(`/client/${clientId}`);
  };

  console.log('clients data ', clients)

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, "dd MMM yyyy, HH:mm");
  };

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
          <Table>
            <TableHeader className="bg-primary">
              <TableRow className="text-white">
                <TableHead className="text-white">Nom du client</TableHead>
                <TableHead className="text-white">Services</TableHead>
                <TableHead className="text-white">Paiement initial</TableHead>
                <TableHead className="text-white">Méthode de paiement</TableHead>
                <TableHead className="text-white">Numéro de téléphone</TableHead>
                <TableHead className="text-white">Responsable</TableHead>
                <TableHead className="text-white">Date de réservation</TableHead>
                <TableHead className="text-white">Montant Restant</TableHead>
                <TableHead className="text-white">Total Montant</TableHead>
                <TableHead className="text-white">Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {currentClients.map((client) => (
                <TableRow key={client._id?.toString()}>
                  <TableCell>
                    {editingId === client._id ? (
                      <Input
                        value={editedClient?.name || ""}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (/^[A-Za-z\s]*$/.test(value)) {
                            setEditedClient({
                              ...editedClient!,
                              name: value,
                            });
                          }
                        }}
                      />
                    ) : (
                      client.name
                    )}
                  </TableCell>

                  <TableCell>
                    {client.services.map((service, index) => (
                      <div key={index}>
                        {service.name}: {(service.price || 0).toLocaleString()} MRU
                      </div>
                    ))}
                  </TableCell>

                  <TableCell>
                    {client.services.map((service, index) => (
                      <div key={index}>
                        {(service.upfrontPayment || 0).toLocaleString()} MRU
                      </div>
                    ))}
                  </TableCell>

                  <TableCell>
                    {editingId === client._id ? (
                      <select
                        value={editedClient?.paymentMethod || ""}
                        onChange={(e) =>
                          setEditedClient({
                            ...editedClient!,
                            paymentMethod: e.target.value,
                          })
                        }
                        className="w-full p-2 border rounded"
                      >
                        <option value="Cash">Cash</option>
                        <option value="Bankily">Bankily</option>
                        <option value="Masrivi">Masrivi</option>
                        <option value="Sedad">Sedad</option>
                        <option value="Click">Click</option>
                      </select>
                    ) : (
                      client.paymentMethod
                    )}
                  </TableCell>

                  <TableCell>
                    {editingId === client._id ? (
                      <Input
                        value={editedClient?.phoneNumber || ""}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (/^\d*$/.test(value) && value.length <= 8) {
                            setEditedClient({
                              ...editedClient!,
                              phoneNumber: value,
                            });
                          }
                        }}
                      />
                    ) : (
                      client.phoneNumber
                    )}
                  </TableCell>

                  <TableCell>
                    {editingId === client._id ? (
                      <Input
                        value={editedClient?.responsable || ""}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (/^[A-Za-z\s]*$/.test(value)) {
                            setEditedClient({
                              ...editedClient!,
                              responsable: value,
                            });
                          }
                        }}
                      />
                    ) : (
                      client.responsable
                    )}
                  </TableCell>

                  <TableCell>{formatDate(client.dateOfBooking || new Date().toISOString())}</TableCell>
                  {/* Montant Restant (Remaining Amount) */}
                  <TableCell>{(client.remainingTotal || 0).toLocaleString()} MRU</TableCell>

                  <TableCell>{(client.totalPrice || 0).toLocaleString()} MRU</TableCell>
                  <TableCell>
                    {editingId === client._id ? (
                      <div className="flex space-x-2">
                        <Button onClick={() => handleSave(client._id!.toString())} size="sm" disabled={loading}>
                          {loading ? (
                            <BeatLoader color="#ffffff" size={5} />
                          ) : (
                            <Check className="h-4 w-4" color="white" />
                          )}
                        </Button>
                        <Button
                          onClick={() => setEditingId(null)}
                          variant="outline"
                          size="sm"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <div className="flex space-x-2">
                        <Button onClick={() => handleEdit(client)} size="sm">
                          <Edit className="h-4 w-4" color="white" />
                        </Button>
                        <Button
                          onClick={() => client._id && handleDelete(client._id.toString())}
                          variant="destructive"
                          size="sm"
                        >
                          {client._id && deletingId === client._id.toString() ? (
                            <BeatLoader color="#ffffff" size={4} />
                          ) : (
                            <Trash className="h-4 w-4" color="white" />
                          )}
                        </Button>
                        <Button
                          className="text-white"
                          onClick={() => client._id && handleEditClientPage(client._id.toString())}
                          size="sm"
                        >
                          Éditer
                        </Button>
                        <Button
                          onClick={() => client._id && handleCheckout(client._id.toString())}
                          size="sm"
                        >
                          <CheckCircle className="h-4 w-4" color="white" />
                        </Button>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {clients.length > clientsPerPage && (
            <div className="flex justify-between items-center px-4 py-2 bg-gray-100 border-t border-gray-200">
              <div className="text-sm text-gray-700">
                {indexOfFirstClient + 1} - {indexOfLastClient} of {clients.length}
              </div>
              <div className="flex items-center gap-2">
                <Button
                  onClick={handlePreviousPage}
                  disabled={currentPage === 1}
                  variant="outline"
                  size="sm"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                  variant="outline"
                  size="sm"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <p className="text-gray-500">Aucun client trouvé.</p>
      )}

      {showInvoice && selectedClient && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="p-8 rounded-lg w-[595px] max-w-full">
            <Invoice userData={selectedClient} onClose={() => setShowInvoice(false)} />
          </div>
        </div>
      )}
    </div>
  );
}