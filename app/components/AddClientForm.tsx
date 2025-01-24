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
  // @ts-expect-error fix
  const [selectedService, setSelectedService] = useState<Service>(servicesList[0]);
  const [serviceAmount, setServiceAmount] = useState<number>(selectedService.price);
  const [upfrontPayment, setUpfrontPayment] = useState<number>(0);
  const [serviceDuration, setServiceDuration] = useState<number>(1); // Duration in hours
  const [services, setServices] = useState<Service[]>(client?.services || []);
  const [paymentMethod, setPaymentMethod] = useState<string>(client?.paymentMethod || paymentMethods[0]);
  const [phoneNumber, setPhoneNumber] = useState<string>(client?.phoneNumber || "");
  const [responsable, setResponsable] = useState<string>(client?.responsable || "");
  const [dateOfBooking, setDateOfBooking] = useState<string>(format(new Date(), "MM/dd")); // Reservation date (MM/DD)
  const [serviceStartDate, setServiceStartDate] = useState<string>(format(new Date(), "MM/dd")); // Service start date (MM/DD)
  const [editingServiceIndex, setEditingServiceIndex] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, "yyyy/MM/dd, hh:mm a");
  };

  useEffect(() => {
    if (client) {
      setDateOfBooking(client.dateOfBooking ? format(new Date(client.dateOfBooking), "MM/dd") : format(new Date(), "MM/dd"));
      setServiceStartDate(client.services[0]?.startDate ? format(new Date(client.services[0].startDate), "MM/dd") : format(new Date(), "MM/dd"));
    } else {
      setDateOfBooking(format(new Date(), "MM/dd"));
      setServiceStartDate(format(new Date(), "MM/dd"));
    }
  }, [client]);

  useEffect(() => {
    if (editingServiceIndex === null) {
      setServiceAmount(selectedService.price);
    }
  }, [selectedService, editingServiceIndex]);

  const handleAddOrModifyService = () => {
    // Vérifier si le service existe déjà dans la liste
    const isServiceAlreadyAdded = services.some(
      (service) => service.name === selectedService.name
    );

    if (isServiceAlreadyAdded && editingServiceIndex === null) {
      toast.error("Ce service a déjà été ajouté.");
      return;
    }

    // Valider le montant du service et le paiement initial
    if (serviceAmount <= 0) {
      toast.error("Veuillez entrer un montant valide pour le service.");
      return;
    }

    if (upfrontPayment > serviceAmount) {
      toast.error("Le paiement initial ne peut pas dépasser le montant du service.");
      return;
    }

    // Valider la durée du service
    if (serviceDuration < 1) {
      toast.error("La durée du service doit être d'au moins 1 heure.");
      return;
    }

    // Valider le format des dates
    if (!/^\d{2}\/\d{2}$/.test(dateOfBooking) || !/^\d{2}\/\d{2}$/.test(serviceStartDate)) {
      toast.error("Veuillez entrer des dates valides au format MM/JJ.");
      return;
    }

    // Convertir les dates en objets Date
    const [bookingMonth, bookingDay] = dateOfBooking.split("/");
    const bookingDate = new Date(new Date().getFullYear(), parseInt(bookingMonth) - 1, parseInt(bookingDay));

    const [startMonth, startDay] = serviceStartDate.split("/");
    const startDate = new Date(new Date().getFullYear(), parseInt(startMonth) - 1, parseInt(startDay), new Date().getHours(), new Date().getMinutes());

    // Valider que la date de réservation n'est pas après la date de début du service
    if (bookingDate > startDate) {
      toast.error("La date de réservation ne peut pas être après la date de début du service.");
      return;
    }

    // Calculer la date de fin en fonction de la durée
    const endDate = new Date(startDate.getTime() + serviceDuration * 60 * 60 * 1000);

    // Créer ou modifier le service
    const newService = {
      name: selectedService.name,
      price: serviceAmount,
      upfrontPayment: upfrontPayment,
      remainingPayment: serviceAmount - upfrontPayment,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
    };

    if (editingServiceIndex !== null) {
      const updatedServices = [...services];
      updatedServices[editingServiceIndex] = newService;
      setServices(updatedServices);
      setEditingServiceIndex(null);
      toast.success("Service modifié avec succès !");
    } else {
      setServices([...services, newService]);
      toast.success("Service ajouté avec succès !");
    }

    // Réinitialiser les champs du formulaire
    setServiceAmount(selectedService.price);
    setUpfrontPayment(0);
    setServiceDuration(1);
    setServiceStartDate(format(new Date(), "MM/dd"));
  };

  const handleRemoveService = (index: number) => {
    const updatedServices = services.filter((_, i) => i !== index);
    setServices(updatedServices);
  };

  const handleEditService = (index: number) => {
    const service = services[index];
    // @ts-expect-error fix
    setSelectedService(servicesList.find((s) => s.name === service.name) || servicesList[0]);
    setServiceAmount(service.price);
    setUpfrontPayment(service.upfrontPayment);
    setServiceDuration(Math.round((new Date(service.endDate).getTime() - new Date(service.startDate).getTime()) / (1000 * 60 * 60)));
    setServiceStartDate(format(new Date(service.startDate), "MM/dd"));
    setEditingServiceIndex(index);
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const totalPrice = services.reduce((sum, service) => sum + service.price, 0);
    const remainingTotal = services.reduce((sum, service) => sum + service.remainingPayment, 0);

    // Validate required fields
    if (!name || !paymentMethod || !phoneNumber || !responsable || services.length === 0 || !dateOfBooking || !serviceStartDate) {
      toast.error("Veuillez remplir tous les champs correctement.");
      return;
    }

    // Validate phone number format
    if (!/^[234]\d{7}$/.test(phoneNumber)) {
      toast.error("Le numéro de téléphone doit commencer par 2, 3 ou 4 et avoir exactement 8 chiffres.");
      return;
    }

    // Validate upfront payment for each service
    for (const service of services) {
      if (service.upfrontPayment > service.price) {
        toast.error(`Le paiement initial pour le service "${service.name}" ne peut pas dépasser le montant du service.`);
        return;
      }
    }

    // Parse reservation date (MM/dd) and convert to full ISO string
    const [bookingMonth, bookingDay] = dateOfBooking.split("/");
    const bookingDate = new Date(new Date().getFullYear(), parseInt(bookingMonth) - 1, parseInt(bookingDay), new Date().getHours(), new Date().getMinutes());

    // Parse service start date (MM/dd) and convert to full ISO string
    const [startMonth, startDay] = serviceStartDate.split("/");
    const startDate = new Date(new Date().getFullYear(), parseInt(startMonth) - 1, parseInt(startDay), new Date().getHours(), new Date().getMinutes());

    // Validate that reservation date is not after the service start date
    if (bookingDate > startDate) {
      toast.error("La date de réservation ne peut pas être après la date de début du service.");
      return;
    }

    // Create the new client object with proper ISO date strings
    const newClient: Client = {
      name,
      services: services.map(service => ({
        ...service,
        startDate: new Date(service.startDate).toISOString(),
        endDate: new Date(service.endDate).toISOString(),
      })),
      paymentMethod,
      phoneNumber,
      responsable,
      dateOfBooking: bookingDate.toISOString(), // Store as ISO string
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
          setServiceStartDate("");
          router.push("/");
        } else {
          toast.error("Échec de l'enregistrement du client.");
        }

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>

      <div>
        <Label htmlFor="dateOfBooking">Date de réservation </Label>
        <Input
          id="dateOfBooking"
          type="date"
          value={
            dateOfBooking
              ? `${new Date().getFullYear()}-${dateOfBooking.replace("/", "-")}` // Convert MM/DD to YYYY-MM-DD
              : ""
          }
          onChange={(e) => {
            const value = e.target.value;
            if (value) {
              // Extract the month and day from the date string (YYYY-MM-DD)
              const [, month, day] = value.split("-");
              const formattedDate = `${month}/${day}`;
              setDateOfBooking(formattedDate);
            } else {
              setDateOfBooking("");
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
              // @ts-expect-error fix
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
            min={0}
          />
        </div>

        <div>
          <Label htmlFor="upfrontPayment">Montant avancé</Label>
          <Input
            id="upfrontPayment"
            type="number"
            placeholder="Paiement initial"
            value={upfrontPayment}
            onChange={(e) => setUpfrontPayment(parseFloat(e.target.value))}
            required
            min={0}
          />
        </div>


        <div>
          <Label htmlFor="serviceStartDate">Date de début du service </Label>
          <Input
            id="serviceStartDate"
            type="date"
            value={
              serviceStartDate
                ? `${new Date().getFullYear()}-${serviceStartDate.replace("/", "-")}` // Convert MM/DD to YYYY-MM-DD
                : ""
            }
            onChange={(e) => {
              const value = e.target.value;
              if (value) {
                // Extract the month and day from the date string (YYYY-MM-DD)
                const [, month, day] = value.split("-");
                const formattedDate = `${month}/${day}`;
                setServiceStartDate(formattedDate);
              } else {
                setServiceStartDate("");
              }
            }}
            required
          />
        </div>

        <div>
          <Label htmlFor="serviceDuration">Durée du service (heures)</Label>
          <Input
            id="serviceDuration"
            type="number"
            placeholder="Durée"
            value={serviceDuration}
            onChange={(e) => setServiceDuration(parseInt(e.target.value))}
            required
            min={1}
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
                <TableHead className="text-white">Montant avancé</TableHead>
                <TableHead className="text-white">Montant restant</TableHead>
                <TableHead className="text-white">Debut de service </TableHead>
                <TableHead className="text-white">   Fin de service</TableHead>
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
                  <TableCell>{formatDate(service.startDate)}</TableCell>
                  <TableCell>{formatDate(service.endDate)}</TableCell>
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
          <div className="mt-2 text-right">
            <span className="text-primary font-semibold">Montant restant: </span> {services.reduce((sum, service) => sum + service.remainingPayment, 0).toLocaleString()} MRU
            <br />
            <span className="text-primary font-semibold">Montant total: </span> {services.reduce((sum, service) => sum + service.price, 0).toLocaleString()} MRU
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
        <Label htmlFor="phoneNumber">Numéro de téléphone</Label>
        <Input
          id="phoneNumber"
          type="text"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
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
          onChange={(e) => setResponsable(e.target.value)}
          required
        />
      </div>

      <Button type="submit" className="text-white" disabled={loading}>
        {loading ? <BeatLoader color="#ffffff" size={8} /> : client ? "Modifier" : "Enregistrer"}
      </Button>
    </form>
  );
}