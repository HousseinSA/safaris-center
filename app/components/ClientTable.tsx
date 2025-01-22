"use client";

import { useState } from "react";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Edit, Trash, Check, X, List, DollarSign, CreditCard, User } from "lucide-react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

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
  const [clients, setClients] = useState<Client[]>(
    JSON.parse(localStorage.getItem("clients") || "[]")
  );
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editedClient, setEditedClient] = useState<Client | null>(null);

  const handleEdit = (client: Client) => {
    setEditingId(client.id);
    setEditedClient({ ...client });
  };

  const handleSave = () => {
    if (editedClient) {
      const updatedClients = clients.map((client) =>
        client.id === editedClient.id ? editedClient : client
      );
      setClients(updatedClients);
      localStorage.setItem("clients", JSON.stringify(updatedClients));
      setEditingId(null);
      setEditedClient(null);
      toast.success("Client modifié avec succès!");
    }
  };

  const handleDelete = (id: number) => {
    const updatedClients = clients.filter((client) => client.id !== id);
    setClients(updatedClients);
    localStorage.setItem("clients", JSON.stringify(updatedClients));
    toast.success("Client supprimé avec succès!");
  };

  const handleEditClientPage = (clientId: number) => {
    router.push(`/client/${clientId}`);
  };

  return (
    <div className="mt-8">
      <h2 className="text-xl font-bold mb-4">Liste des clients</h2>
      {clients.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border">
            <thead>
              <tr className="bg-gray-200">
                <th className="p-2 border text-left">
                  <div className="flex items-center">
                    <User className="h-4 w-4 mr-2" />
                    Nom du client
                  </div>
                </th>
                <th className="p-2 border text-left">
                  <div className="flex items-center">
                    <List className="h-4 w-4 mr-2" />
                    Services
                  </div>
                </th>
                <th className="p-2 border text-left">
                  <div className="flex items-center">
                    <DollarSign className="h-4 w-4 mr-2" />
                    Paiement initial
                  </div>
                </th>
                <th className="p-2 border text-left">
                  <div className="flex items-center">
                    <CreditCard className="h-4 w-4 mr-2" />
                    Méthode de paiement
                  </div>
                </th>
                <th className="p-2 border text-left">Numéro de téléphone</th>
                <th className="p-2 border text-left">Responsable</th>
                <th className="p-2 border text-left">Total</th>
                <th className="p-2 border text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {clients.map((client) => (
                <tr key={client.id} className="hover:bg-gray-100">
                  <td className="p-2 border">
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
                  </td>
                  <td className="p-2 border">
                    {client.services.length > 0 ? (
                      client.services.map((service, index) => (
                        <div key={index}>
                          {service.name}: {service.price} MRO
                        </div>
                      ))
                    ) : (
                      <span className="text-gray-500">Aucun service</span>
                    )}
                  </td>
                  <td className="p-2 border">
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
                  </td>
                  <td className="p-2 border">
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
                  </td>
                  <td className="p-2 border">
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
                  </td>
                  <td className="p-2 border">
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
                  </td>
                  <td className="p-2 border">{client.totalPrice} MRO</td>
                  <td className="p-2 border">
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
                          Éditer la page
                        </Button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-gray-500">Aucun client trouvé.</p>
      )}
    </div>
  );
}