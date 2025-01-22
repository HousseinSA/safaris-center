"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Edit, Trash, Check, X, Phone, Briefcase, Banknote, CreditCard, User, ChevronLeft, ChevronRight, TimerIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { format } from "date-fns";
import { BeatLoader } from "react-spinners";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Client } from "@/lib/types";

export default function ClientTable() {
  const router = useRouter();
  const [clients, setClients] = useState<Client[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editedClient, setEditedClient] = useState<Client | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [loading, setLoading] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null);
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
      setLoading(true)// Start loading animation

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
      setDeletingId(id); // Set the ID of the client being deleted
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

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.error("Échec de la suppression du client");
    } finally {
      setDeletingId(null); // Clear the ID after deletion is complete
    }
  };

  const handleEditClientPage = (clientId: string) => {
    router.push(`/client/${clientId}`); // Naviguer vers la page d'édition du client
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, "dd MMM yyyy, HH:mm");
  };

  return (
    <div className="mt-8">
      <h2 className="text-xl font-bold mb-4 text-primary">Liste des clients</h2>


      {clients.length > 0 ? (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="whitespace-nowrap border">
                  <div className="flex items-center">
                    <User className="h-4 w-4 mr-2" color="#C85E04" />
                    <span className="text-sm sm:text-base font-semibold text-primary">Nom du client</span>
                  </div>
                </TableHead>
                <TableHead className="whitespace-nowrap border">
                  <div className="flex items-center">
                    <Briefcase className="h-4 w-4 mr-2" color="#C85E04" />
                    <span className="text-sm sm:text-base font-semibold text-primary">Services</span>
                  </div>
                </TableHead>
                <TableHead className="whitespace-nowrap border">
                  <div className="flex items-center">
                    <Banknote className="h-4 w-4 mr-2" color="#C85E04" />
                    <span className="text-sm sm:text-base font-semibold text-primary">Paiement initial</span>
                  </div>
                </TableHead>
                <TableHead className="whitespace-nowrap border">
                  <div className="flex items-center">
                    <CreditCard className="h-4 w-4 mr-2" color="#C85E04" />
                    <span className="text-sm sm:text-base font-semibold text-primary">Méthode de paiement</span>
                  </div>
                </TableHead>
                <TableHead className="whitespace-nowrap border">
                  <div className="flex items-center">
                    <Phone className="h-4 w-4 mr-2" color="#C85E04" />
                    <span className="text-sm sm:text-base font-semibold text-primary">Numéro de téléphone</span>
                  </div>
                </TableHead>
                <TableHead className="whitespace-nowrap border">
                  <div className="flex items-center">
                    <User className="h-4 w-4 mr-2" color="#C85E04" />
                    <span className="text-sm sm:text-base font-semibold text-primary">Responsable</span>
                  </div>
                </TableHead>
                <TableHead className="whitespace-nowrap border">
                  <div className="flex items-center">
                    <TimerIcon className="h-4 w-4 mr-2" color="#C85E04" />
                    <span className="text-sm sm:text-base font-semibold text-primary">Date</span>
                  </div>
                </TableHead>
                <TableHead className="whitespace-nowrap border">
                  <div className="flex items-center">
                    <Banknote className="h-4 w-4 mr-2" color="#C85E04" />
                    <span className="text-sm sm:text-base font-semibold text-primary">Total</span>
                  </div>
                </TableHead>
                <TableHead className="whitespace-nowrap border">
                  <span className="text-sm sm:text-base font-semibold text-primary">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentClients.map((client) => (
                <TableRow key={client._id?.toString()} className="hover:bg-gray-100">
                  <TableCell className="border">
                    {editingId === client._id ? ( // Use client._id
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
                  <TableCell className="border">
                    {client.services.length > 0 ? (
                      client.services.map((service, index) => (
                        <div key={index}>
                          <span>{service.name}: {service.price} MRU</span>
                        </div>
                      ))
                    ) : (
                      <span className="text-gray-500">Aucun service</span>
                    )}
                  </TableCell>
                  <TableCell className="border">
                    {editingId === client._id ? ( // Use client._id
                      <Input
                        type="number"
                        value={editedClient?.upfrontPayment || 0}
                        onChange={(e) =>
                          setEditedClient({
                            ...editedClient!,
                            upfrontPayment: parseFloat(e.target.value),
                          })
                        }
                      />
                    ) : (
                      client.upfrontPayment
                    )}
                  </TableCell>
                  <TableCell className="border">
                    {editingId === client._id ? ( // Use client._id
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
                  <TableCell className="border">
                    {editingId === client._id ? ( // Use client._id
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
                  <TableCell className="border">
                    {editingId === client._id ? ( // Use client._id
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
                  <TableCell className="border">

                    {formatDate(client.updatedAt)}
                  </TableCell>
                  <TableCell className="border">{client.totalPrice} MRU</TableCell>
                  <TableCell className="border">
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
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* Pagination Controls (only show if more than 15 clients) */}
          {clients.length > clientsPerPage && (
            <div className="flex justify-between items-center mt-4">
              <Button
                onClick={handlePreviousPage}
                disabled={currentPage === 1}
                variant="outline"
                size="sm"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                variant="outline"
                size="sm"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      ) : (
        <p className="text-gray-500">Aucun client trouvé.</p>
      )}
    </div>
  );
}