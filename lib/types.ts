import { ObjectId } from "mongodb";

export interface Service {
    name: string;
    price: number;
}

export interface Client {
    _id?: ObjectId | string; // Allow both ObjectId and string
    name: string;
    services: Service[];
    paymentMethod: string;
    upfrontPayment: number;
    phoneNumber: string;
    responsable: string;
    totalPrice: number;
    createdAt: string;
    updatedAt: string;
}