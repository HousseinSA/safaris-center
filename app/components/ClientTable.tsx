"use client";

import { useEffect, useState } from "react";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import {
  Edit,
  Trash,
  Check,
  X,
  Phone,
  Briefcase,
  Banknote,
  CreditCard,
  User,
} from "lucide-react"; // Updated icons
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table"; // Import shadcn table components

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
}

export default function ClientTable() {
  const router = useRouter();

  const [clients, setClients] = useState<Client[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editedClient, setEditedClient] = useState<Client | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedClients = JSON.parse(window.localStorage.getItem("clients") || "[]");
      setClients(storedClients);
    }
  }, []);

  const handleEdit = (client: Client) => {
    setEditingId(client.id);
    setEditedClient({ ...client });
  };

  const handleSave = () => {
    if (editedClient && typeof window !== "undefined") {
      const updatedClients = clients.map((client) =>
        client.id === editedClient.id ? editedClient : client
      );
      setClients(updatedClients);
      window.localStorage.setItem("clients", JSON.stringify(updatedClients));
      toast.success("Client modifié avec succès!");
    }
  };

  const handleDelete = (id: number) => {
    if (typeof window !== "undefined") {
      const updatedClients = clients.filter((client) => client.id !== id);
      setClients(updatedClients);
      window.localStorage.setItem("clients", JSON.stringify(updatedClients));
      toast.success("Client supprimé avec succès!");
    }
  };

  const handleEditClientPage = (clientId: number) => {
    router.push(`/client/${clientId}`);
  };

  return (
    <div className="mt-8">
      <h2 className="text-xl font-bold mb-4">Liste des clients</h2>
      {clients.length > 0 ? (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="whitespace-nowrap border">
                  <div className="flex items-center">
                    <User className="h-4 w-4 mr-2" />
                    <span className="text-sm sm:text-base">Nom du client</span>
                  </div>
                </TableHead>
                <TableHead className="whitespace-nowrap border">
                  <div className="flex items-center">
                    <Briefcase className="h-4 w-4 mr-2" />
                    <span className="text-sm sm:text-base">Services</span>
                  </div>
                </TableHead>
                <TableHead className="whitespace-nowrap border">
                  <div className="flex items-center">
                    <Banknote className="h-4 w-4 mr-2" />
                    <span className="text-sm sm:text-base">Paiement initial</span>
                  </div>
                </TableHead>
                <TableHead className="whitespace-nowrap border">
                  <div className="flex items-center">
                    <CreditCard className="h-4 w-4 mr-2" />
                    <span className="text-sm sm:text-base">Méthode de paiement</span>
                  </div>
                </TableHead>
                <TableHead className="whitespace-nowrap border">
                <div className="flex items-center">
    <Phone className="h-4 w-4 mr-2" /> 
    <span className="text-sm sm:text-base">Numéro de téléphone</span> 
  </div>
                </TableHead>
                <TableHead className="whitespace-nowrap border">
                  <div className="flex items-center">
                    <User className="h-4 w-4 mr-2" />
                    <span className="text-sm sm:text-base">Responsable</span>
                  </div>
                </TableHead>
                <TableHead className="whitespace-nowrap border">
                  <div className="flex items-center">
                    <Banknote className="h-4 w-4 mr-2" />
                    <span className="text-sm sm:text-base">Total</span>
                  </div>
                </TableHead>
                <TableHead className="whitespace-nowrap border">
                  <span className="text-sm sm:text-base">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {clients.map((client) => (
                <TableRow key={client.id} className="hover:bg-gray-100">
                  <TableCell className='border'>
                    {editingId === client.id ? (
                      <Input
                        value={editedClient?.name || ""}
                        onChange={(e) =>
                          setEditedClient({
                            ...editedClient!,
                            name: e.target.value,
                          })
                        }
                      />
                    ) : (
                      client.name
                    )}
                  </TableCell>
                  <TableCell className='border'>
                    {client.services.length > 0 ? (
                      client.services.map((service, index) => (
                        <div key={index}>
                          {service.name}: {service.price} MRO
                        </div>
                      ))
                    ) : (
                      <span className="text-gray-500">Aucun service</span>
                    )}
                  </TableCell>
                  <TableCell className='border'>
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
                  <TableCell className='border'>
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
                  <TableCell className='border'>
                    {editingId === client.id ? (
                      <Input
                        value={editedClient?.phoneNumber || ""}
                        onChange={(e) =>
                          setEditedClient({
                            ...editedClient!,
                            phoneNumber: e.target.value,
                          })
                        }
                      />
                    ) : (
                      client.phoneNumber
                    )}
                  </TableCell>
                  <TableCell className='border'>
                    {editingId === client.id ? (
                      <Input
                        value={editedClient?.responsable || ""}
                        onChange={(e) =>
                          setEditedClient({
                            ...editedClient!,
                            responsable: e.target.value,
                          })
                        }
                      />
                    ) : (
                      client.responsable
                    )}
                  </TableCell>
                  <TableCell className='border'>{client.totalPrice} MRU</TableCell>
                  <TableCell className='border'>
                    {editingId === client.id ? (
                      <div className="flex space-x-2">
                        <Button onClick={handleSave} size="sm">
                          <Check className="h-4 w-4" />
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
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          onClick={() => handleDelete(client.id)}
                          variant="destructive"
                          size="sm"
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                        <Button
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
        </div>
      ) : (
        <p className="text-gray-500">Aucun client trouvé.</p>
      )}
    </div>
  );
}