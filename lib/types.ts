import { ObjectId } from "mongodb";
export interface Service {
    name: string;
    price: number;
    upfrontPayment: number;
    remainingPayment: number;
    startDate: string;
    endDate: string;
    upfrontPaymentMethod?: string;
    remainingPaymentMethod?: string;
}
export interface Client {
    _id?: ObjectId | string;
    name: string;
    services: Service[];
    phoneNumber: string;
    responsable: string;
    dateOfBooking: string;
    totalPrice: number;
    remainingTotal: number;
    createdAt?: string ;
    updatedAt?: string;
}

export interface Expense {
    _id?: ObjectId | string;
    name: string;
    price: number;
    responsable: string;
    date: string;
    paymentMethod: string;
}
export interface MonthlyData {
    month: string;
    totalServices: number;
    totalExpenses: number;
    benefits: number;
}
