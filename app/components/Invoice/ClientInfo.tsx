import { Client } from "@/lib/types";
import formatDate from "@/lib/formatDate";

interface ClientInfoProps {
    client: Client;
}

const ClientInfo: React.FC<ClientInfoProps> = ({ client }) => {
    return (
        <div className="mt-4 space-y-1">
            <h2 className="font-semibold">Facturer à :</h2>
            <div className="text-xs">
                <p><span className="font-medium">Nom de client:</span> {client.name}</p>
                <p><span className="font-medium">Date de réservation:</span> {formatDate(client.dateOfBooking)}</p>
                <p><span className="font-medium">Tél:</span> {client.phoneNumber}</p>
                <p><span className="font-medium">Méthode de Paiement:</span> {client.paymentMethod}</p>
            </div>
        </div>
    );
};
export default ClientInfo