import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { Client } from "@/lib/types";
import { useService } from "./useService";
import { showToast } from "@/lib/showToast";

interface UseClientFormProps {
    client?: Client;
    onSave?: (client: Client) => void;
}

export const useClientForm = ({ client, onSave }: UseClientFormProps) => {
    const router = useRouter();
    const [name, setName] = useState<string>(client?.name || "");
    const [phoneNumber, setPhoneNumber] = useState<string>(client?.phoneNumber || "");
    const [responsable, setResponsable] = useState<string>(client?.responsable || "");
    const [dateOfBooking, setDateOfBooking] = useState<string>(format(new Date(), "MM/dd"));
    const [loading, setLoading] = useState<boolean>(false);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [newDate, setNewDate] = useState<string | null>(null);

    const {
        services,
        selectedService,
        serviceAmount,
        upfrontPayment,
        serviceDuration,
        serviceStartDate,
        editingServiceIndex,
        showServiceInput,
        setSelectedService,
        setServiceAmount,
        setUpfrontPayment,
        setServiceDuration,
        setServiceStartDate,
        setShowServiceInput,
        handleAddOrModifyService,
        handleRemoveService,
        handleEditService,
        resetServices,
        upfrontPaymentMethod,
        setUpfrontPaymentMethod,
        remainingPaymentMethod,
        setRemainingPaymentMethod,
        completePayment,
    } = useService(client?.services || [], dateOfBooking);

    useEffect(() => {
        if (client) {
            setDateOfBooking(client.dateOfBooking ? format(new Date(client.dateOfBooking), "MM/dd") : format(new Date(), "MM/dd"));
        }
    }, [client]);

    const handleDateChange = (newDate: string) => {
        if (services.length > 0) {
            setNewDate(newDate);
            setIsModalOpen(true);
        } else {
            setDateOfBooking(newDate);
        }
    };

    const handleConfirmDateChange = () => {
        if (newDate) {
            resetServices();
            setDateOfBooking(newDate);
        }
        setIsModalOpen(false);
    };

    const handleCancelDateChange = () => {
        setIsModalOpen(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (services.length === 0) {
            showToast('error', "Veuillez ajouter au moins un service pour créer un client.");
            return;
        }

        const totalPrice = services.reduce((sum, service) => sum + service.price, 0);
        const remainingTotal = services.reduce((sum, service) => sum + (service.remainingPayment || 0), 0);

        if (!name || !phoneNumber || !responsable || !dateOfBooking) {
            showToast('error', "Veuillez remplir tous les champs correctement.");
            return;
        }

        if (!/^[234]\d{7}$/.test(phoneNumber)) {
            showToast("error", "Le numéro de téléphone doit commencer par 2, 3 ou 4 et avoir exactement 8 chiffres.");
            return;
        }

        for (const service of services) {
            if (service.upfrontPayment > service.price) {
                showToast("error", `Le paiement initial pour le service "${service.name}" ne peut pas dépasser le montant du service.`);
                return;
            }
        }
                
        const [bookingMonth, bookingDay] = dateOfBooking.split("/");
        const bookingDate = new Date(new Date().getFullYear(), parseInt(bookingMonth) - 1, parseInt(bookingDay), new Date().getHours(), new Date().getMinutes());
        const newClient: Client = {
            name,
            services: services.map(service => ({
                ...service,
                startDate: new Date(service.startDate).toISOString(),
                endDate: new Date(service.endDate).toISOString(),
                upfrontPaymentMethod: service.upfrontPaymentMethod,
                remainingPaymentMethod: service.remainingPaymentMethod,
            })),
            phoneNumber,
            responsable,
            dateOfBooking: bookingDate.toISOString(),
            totalPrice,
            remainingTotal,
            createdAt: client?.createdAt || new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };

        setLoading(true);

        if (onSave) {
            onSave(newClient);
            showToast("success", "Client modifié avec succès !");
            router.push("/");
        } else {
            try {
                const response = await fetch("/api/clients", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(newClient),
                });

                if (response.ok) {
                    showToast("success", "Client enregistré avec succès !");
                    router.push("/");
                } else {
                    showToast("error", "Échec de l'enregistrement du client.");
                }

                // eslint-disable-next-line @typescript-eslint/no-unused-vars
            } catch (error) {
                showToast('error', "Échec de l'enregistrement du client.");
            } finally {
                setLoading(false);
            }
        }
    };

    return {
        name,
        setName,
        phoneNumber,
        setPhoneNumber,
        responsable,
        setResponsable,
        dateOfBooking,
        setDateOfBooking: handleDateChange,
        loading,
        services,
        selectedService,
        serviceAmount,
        upfrontPayment,
        serviceDuration,
        serviceStartDate,
        editingServiceIndex,
        showServiceInput,
        setSelectedService,
        setServiceAmount,
        setUpfrontPayment,
        setServiceDuration,
        setServiceStartDate,
        setShowServiceInput,
        handleAddOrModifyService,
        handleRemoveService,
        handleEditService,
        handleSubmit,
        isModalOpen,
        handleConfirmDateChange,
        handleCancelDateChange,
        upfrontPaymentMethod,
        setUpfrontPaymentMethod,
        remainingPaymentMethod,
        setRemainingPaymentMethod,
        completePayment, // Add this line
    };
};