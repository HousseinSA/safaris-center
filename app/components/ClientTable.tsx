"use client";

import { useEffect, useState } from "react";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Edit, Trash, Check, X, Phone, Briefcase, Banknote, CreditCard, User, ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { format } from "date-fns"; // Import date-fns for date formatting
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";

interface Service {
  name: string;
  price: number;
}

interface Client {
  id: number;
  name: string;
  services: Service[];
  paymentMethod: string;
  upfrontPayment: number;
  phoneNumber: string;
  responsable: string;
  totalPrice: number;
  createdAt: string; // Creation date
  updatedAt: string; // Last update date
}

export default function ClientTable() {
  const router = useRouter();
  const [clients, setClients] = useState<Client[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editedClient, setEditedClient] = useState<Client | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false); // Loading state
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

  const handleEdit = (client: Client) => {
    setEditingId(client.id);
    setEditedClient({ ...client });
  };

  const handleSave = async () => {
    if (editedClient) {
        if (editedClient.phoneNumber.length !== 8 || !/^[234]/.test(editedClient.phoneNumber)) {
            toast.error("Le numéro de téléphone doit commencer par 2, 3 ou 4 et avoir exactement 8 chiffres.");
            return;
        }

        setLoading(true); // Start loading

        try {
            const updatedClient = {
                ...editedClient,
                updatedAt: new Date().toISOString(), // Update the "updatedAt" field
            };

            const response = await fetch("/api/clients", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updatedClient),
            });

            if (response.ok) {
                toast.success("Client modifié avec succès!");
                await fetchClients(); // Refresh the client list
                setEditingId(null); // Exit edit mode
                setEditedClient(null); // Clear edited client data
            } else {
                toast.error("Failed to update client");
            }
        }
        //  catch (error) {
        //     toast.error("Failed to update client");
        // }
         finally {
            setLoading(false); // Stop loading
        }
    }
};
  const handleDelete = async (id: number) => {
    setLoading(true); // Start loading

    try {
      const response = await fetch("/api/clients", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      if (response.ok) {
        toast.success("Client supprimé avec succès!");
        fetchClients(); // Refresh the client list
      } else {
        toast.error("Failed to delete client");
      }
    }
    //  catch (error) {
    //   toast.error("Failed to delete client");
    // }
     finally {
      setLoading(false); // Stop loading
    }
  };

  const handleEditClientPage = (clientId: number) => {
    router.push(`/client/${clientId}`);
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, "dd MMM yyyy, HH:mm"); // e.g., "12 Oct 2023, 14:30"
  };

  return (
    <div className="mt-8">
      <h2 className="text-xl font-bold mb-4 text-primary">Liste des clients</h2>
      {loading ? (
        <div className="flex justify-center items-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : clients.length > 0 ? (
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
                    <Banknote className="h-4 w-4 mr-2" color="#C85E04" />
                    <span className="text-sm sm:text-base font-semibold text-primary">Total</span>
                  </div>
                </TableHead>
                <TableHead className="whitespace-nowrap border">
                  <div className="flex items-center">
                    <span className="text-sm sm:text-base font-semibold text-primary">Date</span>
                  </div>
                </TableHead>
                <TableHead className="whitespace-nowrap border">
                  <span className="text-sm sm:text-base font-semibold text-primary">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentClients.map((client) => (
                <TableRow key={client.id} className="hover:bg-gray-100">
                  <TableCell className="border">
                    {editingId === client.id ? (
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
                          <span>{service.name}: {service.price} MRO</span>
                        </div>
                      ))
                    ) : (
                      <span className="text-gray-500">Aucun service</span>
                    )}
                  </TableCell>
                  <TableCell className="border">
                    {editingId === client.id ? (
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
                    {editingId === client.id ? (
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
                    {editingId === client.id ? (
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
                    {editingId === client.id ? (
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
                  <TableCell className="border">{client.totalPrice} MRU</TableCell>
                  <TableCell className="border">
                    {formatDate(client.updatedAt)} {/* Show last updated date */}
                  </TableCell>
                  <TableCell className="border">
                    {editingId === client.id ? (
                      <div className="flex space-x-2">
                        <Button onClick={handleSave} size="sm">
                          <Check className="h-4 w-4" color="white" />
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
                          onClick={() => handleDelete(client.id)}
                          variant="destructive"
                          size="sm"
                        >
                          <Trash className="h-4 w-4" color="white" />
                        </Button>
                        <Button
                          className="text-white"
                          onClick={() => handleEditClientPage(client.id)}
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