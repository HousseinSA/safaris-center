"use client";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Trash, Edit } from "lucide-react";
import { BeatLoader } from "react-spinners";
import { Client, Service } from "@/lib/types";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
const servicesList = [
  { name: "Qued Sefari", price: 0 },
  { name: "Camping Nkc Scape", price: 0 },
  { name: "Camping personnalisé", price: 0 },
];

const paymentMethods = ["Cash", "Bankily", "Masrivi", "Sedad", "Click"];

interface AddClientFormProps {
  client?: Client;
  onSave?: (client: Client) => void;
}

export default function AddClientForm({ client, onSave }: AddClientFormProps) {
  const router = useRouter();
  const [name, setName] = useState<string>(client?.name || "");
  const [selectedService, setSelectedService] = useState<Service>(servicesList[0]);
  const [serviceAmount, setServiceAmount] = useState<number>(selectedService.price);
  const [upfrontPayment, setUpfrontPayment] = useState<number>(0);
  const [serviceStartDate, setServiceStartDate] = useState<string>(new Date().toISOString().slice(0, 16));
  const [serviceEndDate, setServiceEndDate] = useState<string>(new Date().toISOString().slice(0, 16));
  const [services, setServices] = useState<Service[]>(client?.services || []);
  const [paymentMethod, setPaymentMethod] = useState<string>(client?.paymentMethod || paymentMethods[0]);
  const [phoneNumber, setPhoneNumber] = useState<string>(client?.phoneNumber || "");
  const [responsable, setResponsable] = useState<string>(client?.responsable || "");
  const [dateOfBooking, setDateOfBooking] = useState<string>("");
  const [dateOfEnding, setDateOfEnding] = useState<string>("");
  const [editingServiceIndex, setEditingServiceIndex] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, "dd MMM yyyy, hh:mm a");
  };

  useEffect(() => {
    if (client) {
      setDateOfBooking(client.dateOfBooking || new Date().toISOString());
    } else {
      setDateOfBooking(new Date().toISOString());
      setDateOfEnding(new Date().toISOString());
    }
  }, [client]);

  useEffect(() => {
    if (editingServiceIndex === null) {
      setServiceAmount(selectedService.price);
    }
  }, [selectedService, editingServiceIndex]);

  const handleAddOrModifyService = () => {
    if (serviceAmount <= 0) {
      toast.error("Veuillez entrer un montant valide pour le service.");
      return;
    }

    if (upfrontPayment > serviceAmount) {
      toast.error("Le paiement initial ne peut pas dépasser le montant du service.");
      return;
    }

    const newService = {
      name: selectedService.name,
      price: serviceAmount,
      upfrontPayment: upfrontPayment,
      remainingPayment: serviceAmount - upfrontPayment,
      startDate: new Date(serviceStartDate).toISOString(),
      endDate: new Date(serviceEndDate).toISOString(),
    };

    if (editingServiceIndex !== null) {
      const updatedServices = [...services];
      updatedServices[editingServiceIndex] = newService;
      setServices(updatedServices);
      setEditingServiceIndex(null);
      toast.success("Service modifié avec succès !");
    } else {
      setServices([...services, newService]);
      toast.success("Service créé avec succès !");
    }

    setServiceAmount(selectedService.price);
    setUpfrontPayment(0);
    setServiceStartDate(new Date().toISOString().slice(0, 16));
    setServiceEndDate(new Date().toISOString().slice(0, 16));
  };

  const handleRemoveService = (index: number) => {
    const updatedServices = services.filter((_, i) => i !== index);
    setServices(updatedServices);
  };

  const handleEditService = (index: number) => {
    const service = services[index];
    setSelectedService(servicesList.find((s) => s.name === service.name) || servicesList[0]);
    setServiceAmount(service.price);
    setUpfrontPayment(service.upfrontPayment);
    setServiceStartDate(service.startDate.slice(0, 16));
    setServiceEndDate(service.endDate.slice(0, 16));
    setEditingServiceIndex(index);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const totalPrice = services.reduce((sum, service) => sum + service.price, 0);
    const remainingTotal = services.reduce((sum, service) => sum + service.remainingPayment, 0);

    if (!name || !paymentMethod || !phoneNumber || !responsable || services.length === 0 || !dateOfBooking || !dateOfEnding) {
      toast.error("Veuillez remplir tous les champs correctement.");
      return;
    }

    if (!/^[234]\d{7}$/.test(phoneNumber)) {
      toast.error("Le numéro de téléphone doit commencer par 2, 3 ou 4 et avoir exactement 8 chiffres.");
      return;
    }

    for (const service of services) {
      if (service.upfrontPayment > service.price) {
        toast.error(`Le paiement initial pour le service "${service.name}" ne peut pas dépasser le montant du service.`);
        return;
      }
    }

    const newClient: Client = {
      name,
      services,
      paymentMethod,
      phoneNumber,
      responsable,
      dateOfBooking,
      totalPrice,
      remainingTotal,
      createdAt: client?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setLoading(true);

    if (onSave) {
      onSave(newClient);
      toast.success("Client modifié avec succès !");
      router.push("/");
    } else {
      try {
        const response = await fetch("/api/clients", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newClient),
        });

        if (response.ok) {
          toast.success("Client enregistré avec succès !");
          setName("");
          setServices([]);
          setPaymentMethod(paymentMethods[0]);
          setPhoneNumber("");
          setResponsable("");
          setDateOfBooking("");
          setDateOfEnding("");
          router.push("/");
        } else {
          toast.error("Échec de l'enregistrement du client.");
        }
      } catch (error) {
        toast.error("Échec de l'enregistrement du client.");
      } finally {
        setLoading(false);
      }
    }
  };

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
            value={serviceAmount === null ? "" : serviceAmount} // Show empty string if null
            onChange={(e) => {
              const value = e.target.value;
              // If the input is empty, set to null (or empty string)
              if (value === "") {
                setServiceAmount(null); // or setServiceAmount("");
              } else {
                // Otherwise, parse the value as a number
                const parsedValue = parseFloat(value);
                if (!isNaN(parsedValue)) {
                  setServiceAmount(parsedValue);
                }
              }
            }}
            required
            min={0}
          />
        </div>

        <div>
          <Label htmlFor="upfrontPayment">Paiement initial</Label>
          <Input
            id="upfrontPayment"
            type="number"
            placeholder="Paiement initial"
            value={upfrontPayment === null ? "" : upfrontPayment} // Show empty string if null
            onChange={(e) => {
              const value = e.target.value;
              // If the input is empty, set to null (or empty string)
              if (value === "") {
                setUpfrontPayment(null); // or setUpfrontPayment("");
              } else {
                // Otherwise, parse the value as a number
                const parsedValue = parseFloat(value);
                if (!isNaN(parsedValue)) {
                  setUpfrontPayment(parsedValue);
                }
              }
            }}
            required
            min={0}
          />
        </div>

        <div>
          <Label htmlFor="serviceStartDate">Date de début de service</Label>
          <Input
            id="serviceStartDate"
            type="datetime-local"
            value={serviceStartDate}
            onChange={(e) => setServiceStartDate(e.target.value)}
            required
          />
        </div>

        <div>
          <Label htmlFor="serviceEndDate">Date de fin de service</Label>
          <Input
            id="serviceEndDate"
            type="datetime-local"
            value={serviceEndDate}
            onChange={(e) => setServiceEndDate(e.target.value)}
            required
          />
        </div>
      </div>

      <Button
        type="button"
        onClick={handleAddOrModifyService}
        className="text-white"
      >
        {editingServiceIndex !== null ? "Modifier le service" : "Ajouter le service"}
      </Button>

      {services.length > 0 && (
        <div>
          <Label>Services ajoutés</Label>
          <Table>
            <TableHeader className="bg-primary">
              <TableRow>
                <TableHead className="text-white">Service</TableHead>
                <TableHead className="text-white">Montant</TableHead>
                <TableHead className="text-white">Paiement initial</TableHead>
                <TableHead className="text-white">Paiement restant</TableHead>
                <TableHead className="text-white">Date de début de service</TableHead>
                <TableHead className="text-white">Date de fin de service</TableHead>
                <TableHead className="text-white">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {services.map((service, index) => (
                <TableRow key={index}>
                  <TableCell>{service.name}</TableCell>
                  <TableCell>{service.price.toLocaleString()} MRU</TableCell>
                  <TableCell>{service.upfrontPayment.toLocaleString()} MRU</TableCell>
                  <TableCell>{service.remainingPayment.toLocaleString()} MRU</TableCell>
                  <TableCell>{formatDate(service.startDate)}</TableCell> {/* Formatted start date */}
                  <TableCell>{formatDate(service.endDate)}</TableCell> {/* Formatted end date */}
                  <TableCell>
                    <Button
                      type="button"
                      onClick={() => handleEditService(index)}
                      className="text-white"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
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
          <div className="mt-2 text-right ">
            <span className="text-primary font-semibold">Montant Restant: </span> {services.reduce((sum, service) => sum + service.remainingPayment, 0).toLocaleString()} MRU
            <br />
            <span className="text-primary font-semibold">Total Montant: </span> {services.reduce((sum, service) => sum + service.price, 0).toLocaleString()} MRU

          </div>
        </div>
      )}
      <div>
        <Label htmlFor="dateOfBooking">Date de réservation</Label>
        <Input
          id="dateOfBooking"
          type="datetime-local"
          value={dateOfBooking.slice(0, 16)}
          onChange={(e) => setDateOfBooking(new Date(e.target.value).toISOString())}
          required
        />
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
        <Label htmlFor="phoneNumber">Numéro de téléphone</Label>
        <Input
          id="phoneNumber"
          type="text"
          value={phoneNumber}
          onChange={(e) => {
            const value = e.target.value;
            if (/^\d*$/.test(value) && value.length <= 8) {
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


      {/* <div>
        <Label htmlFor="dateOfEnding">Date de fin</Label>
        <Input
          id="dateOfEnding"
          type="datetime-local"
          value={dateOfEnding.slice(0, 16)}
          onChange={(e) => setDateOfEnding(new Date(e.target.value).toISOString())}
          required
        />
      </div> */}

      <Button type="submit" className="text-white" disabled={loading}>
        {loading ? <BeatLoader color="#ffffff" size={8} /> : client ? "Modifier" : "Enregistrer"}
      </Button>
    </form>
  );
}