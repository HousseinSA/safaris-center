// src/store/clientFormStore.ts
import { create } from 'zustand';
import { format } from 'date-fns';
import { Client, Service } from '@/lib/types'; // Import your types
import { servicesList, paymentMethods } from '@/lib/servicesPaymentData';

interface ClientFormState {
    client: Client
    selectedService: Service;
    serviceAmount: number;
    upfrontPayment: number;
    serviceDuration: number;
    serviceStartDate: string;
    editingServiceIndex: number | null;

    // Setters
    setName: (name: string) => void;
    setSelectedService: (service: Service) => void;
    setServiceAmount: (amount: number) => void;
    setUpfrontPayment: (amount: number) => void;
    setServiceDuration: (duration: number) => void;
    setServices: (services: Service[]) => void;
    setPaymentMethod: (method: string) => void;
    setPhoneNumber: (phone: string) => void;
    setResponsable: (responsable: string) => void;
    setDateOfBooking: (date: string) => void;
    setServiceStartDate: (date: string) => void;
    setEditingServiceIndex: (index: number | null) => void;

    // Reset Form
    resetForm: () => void;
}

export const useClientFormStore = create<ClientFormState>((set) => ({
    // Client Fields
    _id: undefined,
    name: '',
    services: [],
    paymentMethod: paymentMethods[0], // Default to first payment method
    phoneNumber: '',
    responsable: '',
    dateOfBooking: format(new Date(), 'MM/dd'),
    createdAt: undefined,
    updatedAt: undefined,

    // Service Form Fields
    selectedService: servicesList[0], // Default to first service
    serviceAmount: servicesList[0].price,
    upfrontPayment: 0,
    serviceDuration: 1,
    serviceStartDate: format(new Date(), 'MM/dd'),
    editingServiceIndex: null,

    // Setters
    setName: (name) => set({ name }),
    setSelectedService: (selectedService) => set({ selectedService }),
    setServiceAmount: (serviceAmount) => set({ serviceAmount }),
    setUpfrontPayment: (upfrontPayment) => set({ upfrontPayment }),
    setServiceDuration: (serviceDuration) => set({ serviceDuration }),
    setServices: (services) => set({ services }),
    setPaymentMethod: (paymentMethod) => set({ paymentMethod }),
    setPhoneNumber: (phoneNumber) => set({ phoneNumber }),
    setResponsable: (responsable) => set({ responsable }),
    setDateOfBooking: (dateOfBooking) => set({ dateOfBooking }),
    setServiceStartDate: (serviceStartDate) => set({ serviceStartDate }),
    setEditingServiceIndex: (editingServiceIndex) => set({ editingServiceIndex }),

    // Reset Form
    resetForm: () =>
        set({
            _id: undefined,
            name: '',
            services: [],
            paymentMethod: paymentMethods[0],
            phoneNumber: '',
            responsable: '',
            dateOfBooking: format(new Date(), 'MM/dd'),
            createdAt: undefined,
            updatedAt: undefined,
            selectedService: servicesList[0],
            serviceAmount: servicesList[0].price,
            upfrontPayment: 0,
            serviceDuration: 1,
            serviceStartDate: format(new Date(), 'MM/dd'),
            editingServiceIndex: null,
        }),
}));