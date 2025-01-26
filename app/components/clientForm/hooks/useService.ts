import { useState } from "react";
import { Service } from "@/lib/types";
import { toast } from "react-hot-toast";
import { format } from "date-fns";
import { servicesList } from "@/lib/servicesPaymentData";

export const useService = (initialServices: Service[] = [], initialDateOfBooking: string) => {
    const [services, setServices] = useState<Service[]>(initialServices);
    const [selectedService, setSelectedService] = useState<Service>(servicesList[0]);
    const [serviceAmount, setServiceAmount] = useState<number>(selectedService.price);
    const [upfrontPayment, setUpfrontPayment] = useState<number>(0);
    const [serviceDuration, setServiceDuration] = useState<number>(1); // Duration in hours
    const [serviceStartDate, setServiceStartDate] = useState<string>(initialDateOfBooking); // Default to reservation date
    const [editingServiceIndex, setEditingServiceIndex] = useState<number | null>(null);
    const [showServiceInput, setShowServiceInput] = useState<boolean>(false);

    // Function to reset all services
    const resetServices = () => {
        setServices([]); // Clear all services
        setShowServiceInput(false); // Hide the service input form
    };

    // Function to validate the service

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const validateService = (dateOfBooking: string): boolean => {
        if (serviceAmount <= 0) {
            toast.error("Veuillez entrer un montant valide pour le service.");
            return false;
        }

        if (upfrontPayment > serviceAmount) {
            toast.error("Le paiement initial ne peut pas dépasser le montant du service.");
            return false;
        }

        if (serviceDuration < 1) {
            toast.error("La durée du service doit être d'au moins 1 heure.");
            return false;
        }

        return true;
    };

    // Function to handle adding or modifying a service
    const handleAddOrModifyService = (dateOfBooking: string) => {
        if (!validateService(dateOfBooking)) return;

        // Check if the service already exists (only if not editing)
        if (editingServiceIndex === null) {
            const isServiceAlreadyAdded = services.some(
                (service) => service.name === selectedService.name
            );

            if (isServiceAlreadyAdded) {
                toast.error("Ce service a déjà été ajouté.");
                return;
            }
        }

        const [startMonth, startDay] = serviceStartDate.split("/");
        const startDate = new Date(new Date().getFullYear(), parseInt(startMonth) - 1, parseInt(startDay), new Date().getHours(), new Date().getMinutes());
        const endDate = new Date(startDate.getTime() + serviceDuration * 60 * 60 * 1000);

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

        // Reset form fields
        setServiceAmount(selectedService.price);
        setUpfrontPayment(0);
        setServiceDuration(1);
        setServiceStartDate(dateOfBooking); // Reset to the reservation date
        setShowServiceInput(false);
    };

    // Function to handle removing a service
    const handleRemoveService = (index: number) => {
        const updatedServices = services.filter((_, i) => i !== index);
        setServices(updatedServices);
    };

    // Function to handle editing a service
    const handleEditService = (index: number) => {
        const service = services[index];
        setSelectedService(servicesList.find((s) => s.name === service.name) || servicesList[0]);
        setServiceAmount(service.price);
        setUpfrontPayment(service.upfrontPayment);
        setServiceDuration(Math.round((new Date(service.endDate).getTime() - new Date(service.startDate).getTime()) / (1000 * 60 * 60)));
        setServiceStartDate(format(new Date(service.startDate), "MM/dd"));
        setEditingServiceIndex(index);
        setShowServiceInput(true);
    };

    return {
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
    };
};