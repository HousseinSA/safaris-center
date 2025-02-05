import { useState } from "react";
import { Service } from "@/lib/types";
import { toast } from "react-hot-toast";
import { format } from "date-fns";
import { servicesList } from "@/lib/servicesPaymentData";

export const useService = (initialServices: Service[] = [], initialDateOfBooking: string) => {
    const [services, setServices] = useState<Service[]>(initialServices);
    const [serviceDuration, setServiceDuration] = useState<number>(1);
    const [serviceStartDate, setServiceStartDate] = useState<string>(initialDateOfBooking);
    const [editingServiceIndex, setEditingServiceIndex] = useState<number | null>(null);
    const [showServiceInput, setShowServiceInput] = useState<boolean>(false);
    const [selectedService, setSelectedService] = useState<Service>(servicesList[0]);
    const [serviceAmount, setServiceAmount] = useState<number>(selectedService.price);
    const [upfrontPayment, setUpfrontPayment] = useState<number>(0);
    const [upfrontPaymentMethod, setUpfrontPaymentMethod] = useState<string>("");
    const [remainingPaymentMethod, setRemainingPaymentMethod] = useState<string>("")
    const resetServices = () => {
        setServices([]);
        setShowServiceInput(false);
    };

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

    const handleAddOrModifyService = (dateOfBooking: string) => {
        // Validate service fields
        if (!validateService(dateOfBooking)) return;

        // Check upfront payment method when adding or modifying a service
        if (upfrontPayment > 0 && !upfrontPaymentMethod) {
            toast.error("Veuillez sélectionner un mode de paiement pour le montant avancé.");
            return; // Stop the function if payment method is not selected
        }

        const [startMonth, startDay] = serviceStartDate.split("/");
        const startDate = new Date(new Date().getFullYear(), parseInt(startMonth) - 1, parseInt(startDay), new Date().getHours(), new Date().getMinutes());
        const endDate = new Date(startDate.getTime() + serviceDuration * 60 * 60 * 1000);

        const newService: Service = {
            name: selectedService.name,
            price: serviceAmount,
            upfrontPayment: upfrontPayment,
            remainingPayment: Math.max(0, serviceAmount - upfrontPayment),
            startDate: startDate.toISOString(),
            endDate: endDate.toISOString(),
            upfrontPaymentMethod: upfrontPayment > 0 ? upfrontPaymentMethod : "",
            remainingPaymentMethod: remainingPaymentMethod || "", // Save the selected method
        };

        // Check for duplicates only when adding a new service
        if (editingServiceIndex === null) {
            const serviceExists = services.some(service => service.name === newService.name);
            if (serviceExists) {
                toast.error(`Le service "${newService.name}" existe déjà.`);
                return;
            }
        }

        // Add or modify the service in the state
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

        // Reset form fields and selected service to initial state
        resetServiceForm();
        setShowServiceInput(false);
    };

    const resetServiceForm = () => {
        setSelectedService(servicesList[0]); // Reset to the initial selected service
        setServiceAmount(servicesList[0].price);
        setUpfrontPayment(0);
        setServiceDuration(1);
        setServiceStartDate(""); // Or set to initial booking date
        setUpfrontPaymentMethod("");
        setRemainingPaymentMethod(""); // Reset remaining payment method
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
        setServiceDuration(Math.round((new Date(service.endDate).getTime() - new Date(service.startDate).getTime()) / (1000 * 60 * 60)));
        setServiceStartDate(format(new Date(service.startDate), "MM/dd"));
        setUpfrontPaymentMethod(service.upfrontPaymentMethod || "");
        setRemainingPaymentMethod(service.remainingPaymentMethod || "");
        setEditingServiceIndex(index);
        setShowServiceInput(true);
    };

    const completePayment = (name: string) => {
        const updatedServices = services.map(service => {
            if (service.name === name) {
                // If a payment method is set, mark the service as paid
                if (service.remainingPaymentMethod) {
                    // toast.success(`Le service "${name}" est maintenant marqué comme payé.`);
                }
            }
            return service;
        });
        setServices(updatedServices);
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
        completePayment,
        upfrontPaymentMethod,
        setUpfrontPaymentMethod,
        remainingPaymentMethod, // Ensure this is returned
        setRemainingPaymentMethod, // Ensure this is returned
    }
};