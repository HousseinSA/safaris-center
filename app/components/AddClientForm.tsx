"use client";

import { useState } from "react";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Label } from "../components/ui/label";
import { Trash } from "lucide-react"; // Import the Trash icon from lucide-react

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

const servicesList = [
  { name: "Qued Sefari", price: 0 },
  { name: "Camping Nkc Scape", price: 0 },
  { name: "Camping personnalisé", price: 0 },
];

const paymentMethods = ["Cash", "Bankily", "Masrivi", "Sedad", "Click"];

export default function AddClientForm() {
  const [name, setName] = useState<string>("");
  const [selectedService, setSelectedService] = useState<Service>(servicesList[0]);
  const [serviceAmount, setServiceAmount] = useState<number>(0);
  const [services, setServices] = useState<Service[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<string>(paymentMethods[0]);
  const [upfrontPayment, setUpfrontPayment] = useState<number>(0);
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [responsable, setResponsable] = useState<string>("");

  const handleAddService = () => {
    if (serviceAmount <= 0) {
      alert("Veuillez entrer un montant valide pour le service.");
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate input data
    if (!name || !paymentMethod || upfrontPayment < 0 || !phoneNumber || !responsable || services.length === 0) {
      alert("Veuillez remplir tous les champs correctement.");
      return;
    }

    // Calculate total price
    const totalPrice = services.reduce((sum, service) => sum + service.price, 0);

    // Create client object
    const client: Client = {
      id: Date.now(),
      name,
      services,
      paymentMethod,
      upfrontPayment,
      phoneNumber,
      responsable,
      totalPrice,
    };

    // Save client to localStorage
    const clients = JSON.parse(localStorage.getItem("clients") || "[]");
    clients.push(client);
    localStorage.setItem("clients", JSON.stringify(clients));

    // Reset form
    setName("");
    setServices([]);
    setPaymentMethod(paymentMethods[0]);
    setUpfrontPayment(0);
    setPhoneNumber("");
    setResponsable("");

    alert("Client enregistré avec succès!");
  };

  // Calculate total price of services
  const totalPrice = services.reduce((sum, service) => sum + service.price, 0);

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
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

      <Button type="button" onClick={handleAddService}>
        Ajouter le service
      </Button>

      <div>
        <Label>Services ajoutés</Label>
        <table className="w-full border-collapse border">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2 border">Service</th>
              <th className="p-2 border">Montant</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {services.map((service, index) => (
              <tr key={index} className="hover:bg-gray-100">
                <td className="p-2 border">{service.name}</td>
                <td className="p-2 border">{service.price} MRO</td>
                <td className="p-2 border">
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleRemoveService(index)}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="mt-2 text-right font-bold">
          Total: {totalPrice} MRO
        </div>
      </div>

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
            if (/^\d*$/.test(value)) {
              setPhoneNumber(value);
            }
          }}
          required
        />
      </div>

      <div>
        <Label htmlFor="responsable">Responsable</Label>
        <Input
          id="responsable"
          type="text"
          value={responsable}
          onChange={(e) => setResponsable(e.target.value)}
          required
        />
      </div>

      <Button type="submit">Enregistrer</Button>
    </form>
  );
}