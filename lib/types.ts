import { ObjectId } from "mongodb";
export interface Service {
    name: string;
    price: number;
    upfrontPayment: number;
    remainingPayment: number;
    startDate: string;
    endDate: string;
}

export interface Client {
    _id?: ObjectId | string;
    name: string;
    services: Service[];
    paymentMethod: string;
    phoneNumber: string;
    responsable: string;
    dateOfBooking: string;
    totalPrice: number;         // Total of all service prices
    remainingTotal: number;     // Total of all remaining payments
    createdAt?: string;
    updatedAt?: string;
}

export interface Expense {
    _id?: ObjectId | string;
    name: string;
    price: number;
    responsable: string;
    date: string; // Use ISO string or Date type
    paymentMethod: string;
}
export interface MonthlyData {
    month: string;
    totalServices: number;
    totalExpenses: number;
    benefits: number;
}
