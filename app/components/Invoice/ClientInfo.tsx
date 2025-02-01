import React from "react";
import { Client } from "@/lib/types";
import formatDate from "@/lib/formatDate";

interface ClientInfoProps {
    client: Client;
}

const ClientInfo: React.FC<ClientInfoProps> = ({ client }) => {
    return (
        <div className="mt-4 space-y-1">
            <h2 className="font-semibold">Facturer à:</h2>
            <div className="text-xs">
                <p><span className="font-semibold">Nom de client:</span> {client.name}</p>
                <p><span className="font-semibold">Date de réservation:</span> {formatDate(client.dateOfBooking)}</p>
                <p><span className="font-semibold">Tél:</span> {client.phoneNumber}</p>
                <p><span className="font-semibold">Méthode de Paiement:</span> {client.paymentMethod}</p>
            </div>
        </div>
    );
};
export default ClientInfo