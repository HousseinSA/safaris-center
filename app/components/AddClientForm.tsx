"use client";

import { useState, useEffect } from "react";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Label } from "../components/ui/label";
import { Trash, Edit } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

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
  createdAt: string; // Add createdAt field
  updatedAt: string; // Add updatedAt field
}

const servicesList = [
  { name: "Qued Sefari", price: 0 },
  { name: "Camping Nkc Scape", price: 0 },
  { name: "Camping personnalisé", price: 0 },
];

const paymentMethods = ["Cash", "Bankily", "Masrivi", "Sedad", "Click"];

interface AddClientFormProps {
  client?: Client; // Optional client prop for edit mode
  onSave?: (client: Client) => void; // Optional callback for saving
}

export default function AddClientForm({ client, onSave }: AddClientFormProps) {
  const router = useRouter();
  const [name, setName] = useState<string>(client?.name || "");
  const [selectedService, setSelectedService] = useState<Service>(servicesList[0]);
  const [serviceAmount, setServiceAmount] = useState<number>(0);
  const [services, setServices] = useState<Service[]>(client?.services || []);
  const [paymentMethod, setPaymentMethod] = useState<string>(client?.paymentMethod || paymentMethods[0]);
  const [upfrontPayment, setUpfrontPayment] = useState<number>(client?.upfrontPayment || 0);
  const [phoneNumber, setPhoneNumber] = useState<string>(client?.phoneNumber || "");
  const [responsable, setResponsable] = useState<string>(client?.responsable || "");
  const [editingServiceIndex, setEditingServiceIndex] = useState<number | null>(null);
  const [editingServiceAmount, setEditingServiceAmount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false); // Loading state

  useEffect(() => {
    if (client) {
      // Pre-fill the form if client data is provided
      setName(client.name);
      setServices(client.services);
      setPaymentMethod(client.paymentMethod);
      setUpfrontPayment(client.upfrontPayment);
      setPhoneNumber(client.phoneNumber);
      setResponsable(client.responsable);
    }
  }, [client]);

  const handleAddService = () => {
    if (serviceAmount <= 0) {
      toast.error("Veuillez entrer un montant valide pour le service.");
      return;
    }

    const newService = {
      name: selectedService.name,
      price: serviceAmount,
    };

    setServices([...services, newService]);
    setServiceAmount(0); // Reset the amount input
  };

  const handleRemoveService = (index: number) => {
    const updatedServices = services.filter((_, i) => i !== index);
    setServices(updatedServices);
  };

  const handleEditService = (index: number) => {
    setEditingServiceIndex(index);
    setEditingServiceAmount(services[index].price);
  };

  const handleSaveEdit = (index: number) => {
    if (editingServiceAmount <= 0) {
      toast.error("Veuillez entrer un montant valide pour le service.");
      return;
    }

    const updatedServices = [...services];
    updatedServices[index].price = editingServiceAmount;
    setServices(updatedServices);
    setEditingServiceIndex(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate input data
    if (!name || !paymentMethod || upfrontPayment < 0 || !phoneNumber || !responsable || services.length === 0) {
      toast.error("Veuillez remplir tous les champs correctement.");
      return;
    }

    // Validate phone number
    if (!/^[234]\d{7}$/.test(phoneNumber)) {
      toast.error("Le numéro de téléphone doit commencer par 2, 3 ou 4 et avoir exactement 8 chiffres.");
      return;
    }

    // Calculate total price
    const totalPrice = services.reduce((sum, service) => sum + service.price, 0);

    // Create client object
    const newClient: Client = {
      id: client?.id || Date.now(), // Use existing ID for edit mode, or generate a new one for add mode
      name,
      services,
      paymentMethod,
      upfrontPayment,
      phoneNumber,
      responsable,
      totalPrice,
      createdAt: client?.createdAt || new Date().toISOString(), // Set createdAt
      updatedAt: new Date().toISOString(), // Set updatedAt
    };

    setLoading(true); // Start loading

    if (onSave) {
      // If onSave callback is provided, use it (for edit mode)
      onSave(newClient);
      router.push("/"); // Redirect to home
    } else {
      // Otherwise, save to MongoDB (for add mode)
      try {
        const response = await fetch("/api/clients", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newClient),
        });

        if (response.ok) {
          toast.success("Client enregistré avec succès!");
          setName("");
          setServices([]);
          setPaymentMethod(paymentMethods[0]);
          setUpfrontPayment(0);
          setPhoneNumber("");
          setResponsable("");
          router.push("/"); // Redirect to home
        } else {
          toast.error("Failed to save client");
        }
      } 
      // catch (error) {
      //   toast.error("Failed to save client");
      // }
       finally {
        setLoading(false); // Stop loading
      }
    }
  };

  // Calculate total price of services
  const totalPrice = services.reduce((sum, service) => sum + service.price, 0);

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      )}
      <div>
        <Label htmlFor="name">Nom du client</Label>
        <Input
          id="name"
          type="text"
          value={name}
          onChange={(e) => {
            const value = e.target.value;
            if (/^[A-Za-z\s]*$/.test(value)) {
              setName(value);
            }
          }}
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="service">Service</Label>
          <select
            id="service"
            value={selectedService.name}
            onChange={(e) => {
              const selected = servicesList.find(
                (service) => service.name === e.target.value
              );
              if (selected) setSelectedService(selected);
            }}
            className="w-full p-2 border rounded"
          >
            {servicesList.map((service, index) => (
              <option key={index} value={service.name}>
                {service.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <Label htmlFor="serviceAmount">Montant du service</Label>
          <Input
            id="serviceAmount"
            type="number"
            placeholder="Montant"
            value={serviceAmount}
            onChange={(e) => setServiceAmount(parseFloat(e.target.value))}
            required
          />
        </div>
      </div>

      <Button type="button" onClick={handleAddService} className="text-white">
        Ajouter le service
      </Button>

      {services.length > 0 && (
        <div>
          <Label>Services ajoutés</Label>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Service</TableHead>
                <TableHead>Montant</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {services.map((service, index) => (
                <TableRow key={index}>
                  <TableCell>{service.name}</TableCell>
                  <TableCell>
                    {editingServiceIndex === index ? (
                      <Input
                        type="number"
                        value={editingServiceAmount}
                        onChange={(e) => setEditingServiceAmount(parseFloat(e.target.value))}
                      />
                    ) : (
                      service.price
                    )} MRU
                  </TableCell>
                  <TableCell>
                    {editingServiceIndex === index ? (
                      <Button
                        type="button"
                        onClick={() => handleSaveEdit(index)}
                        className="text-white"
                      >
                        Sauvegarder
                      </Button>
                    ) : (
                      <Button
                        type="button"
                        onClick={() => handleEditService(index)}
                        className="text-white"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    )}
                    <Button
                      type="button"
                      onClick={() => handleRemoveService(index)}
                      className="text-white ml-2 bg-red-500"
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="mt-2 text-right font-bold">
            Total: {totalPrice} MRU
          </div>
        </div>
      )}

      <div>
        <Label htmlFor="paymentMethod">Méthode de paiement</Label>
        <select
          id="paymentMethod"
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value)}
          className="w-full p-2 border rounded"
          required
        >
          {paymentMethods.map((method, index) => (
            <option key={index} value={method}>
              {method}
            </option>
          ))}
        </select>
      </div>

      <div>
        <Label htmlFor="upfrontPayment">Paiement initial</Label>
        <Input
          id="upfrontPayment"
          type="number"
          value={upfrontPayment}
          onChange={(e) => setUpfrontPayment(parseFloat(e.target.value))}
          required
        />
      </div>

      <div>
        <Label htmlFor="phoneNumber">Numéro de téléphone</Label>
        <Input
          id="phoneNumber"
          type="text"
          value={phoneNumber}
          onChange={(e) => {
            const value = e.target.value;
            if (value === "" || /^[234]\d{0,7}$/.test(value)) {
              setPhoneNumber(value);
            }
          }}
          maxLength={8}
          required
        />
      </div>

      <div>
        <Label htmlFor="responsable">Responsable</Label>
        <Input
          id="responsable"
          type="text"
          value={responsable}
          onChange={(e) => {
            const value = e.target.value;
            if (/^[A-Za-z\s]*$/.test(value)) {
              setResponsable(value);
            }
          }}
          required
        />
      </div>

      <Button type="submit" className="text-white" disabled={loading}>
        {client ? "Modifier" : "Enregistrer"}
      </Button>
    </form>
  );
}