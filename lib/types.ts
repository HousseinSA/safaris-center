import { ObjectId } from "mongodb";

export interface Service {
    name: string;
    price: number;
    upfrontPayment: number; // Initial payment for the service
    remainingPayment: number; // Remaining payment (calculated as price - upfrontPayment)
    startDate: string; // Start date of the service
    endDate: string; // End date of the service
}

export interface Client {
    _id?: ObjectId | string; // Allow both ObjectId and string
    name: string;
    services: Service[]; // Array of services
    paymentMethod: string;
    phoneNumber: string;
    responsable: string;
    dateOfBooking: string; // Booking date for the client
    dateOfEnding: string; // Ending date for the client
    totalPrice: number; // Total price (sum of all remaining payments)
    createdAt: string; // Creation date
    updatedAt: string; // Last update date
}