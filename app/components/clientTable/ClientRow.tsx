import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Edit, Trash, Check, X, CheckCircle } from "lucide-react";
import { BeatLoader } from "react-spinners";
import { Client } from "@/lib/types";
import formatDate from "@/lib/formatDate";
import { TableCell, TableRow } from "../ui/table";

interface ClientRowProps {
    client: Client;
    editingId: string | null;
    editedClient: Client | null;
    loading: boolean;
    deletingId: string | null;
    onEdit: (client: Client | null) => void;
    onSave: (clientId: string) => void;
    onDelete: (id: string) => void;
    onEditClientPage: (clientId: string) => void;
    onCheckout: (clientId: string) => void;
    setEditedClient: (client: Client | null) => void;
}

export const ClientRow = ({
    client,
    editingId,
    editedClient,
    loading,
    deletingId,
    onEdit,
    onSave,
    onDelete,
    onEditClientPage,
    onCheckout,
    setEditedClient,
}: ClientRowProps) => {
    const isEditing = editingId === client._id;

    const totalRemainingPayment = client.services.reduce((sum, service) => {
        return service.remainingPaymentMethod ? sum : sum + service.remainingPayment;
    }, 0);

    const reservationDate = new Date(client.dateOfBooking);
    const hasTimeInfo = reservationDate.getHours() !== 0 || reservationDate.getMinutes() !== 0;
    const displayDate = hasTimeInfo
        ? formatDate(reservationDate.toISOString())
        : formatDate(client.createdAt || new Date());

    // Event handlers
    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (/^[A-Za-z\s]*$/.test(value)) {
            setEditedClient({ ...editedClient!, name: value });
        }
    };

    const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (/^\d*$/.test(value) && value.length <= 8) {
            setEditedClient({ ...editedClient!, phoneNumber: value });
        }
    };

    const handleResponsableChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (/^[A-Za-z\s]*$/.test(value)) {
            setEditedClient({ ...editedClient!, responsable: value });
        }
    };

    return (
        <TableRow key={client._id?.toString()}>
            <TableCell>
                {isEditing ? (
                    <Input value={editedClient?.name || ""} onChange={handleNameChange} />
                ) : (
                    client.name
                )}
            </TableCell>

            <TableCell>
                {client.services.map((service, index) => (
                    <span key={index} className={`block mb-2 ${index < client.services.length - 1 ? "border-b border-primary pb-2" : ""}`}>
                        <span className="font-semibold">{service.name}:</span> {(service.price || 0).toLocaleString()} MRU
                    </span>
                ))}
            </TableCell>

            <TableCell>
                {client.services.map((service, index) => (
                    <span key={index} className={`block mb-1 text-center ${index < client.services.length - 1 ? "border-b border-primary pb-1" : ""}`}>
                        {(service.upfrontPayment || 0).toLocaleString()} MRU
                    </span>
                ))}
            </TableCell>

            <TableCell className="text-center">
                {client.services.length > 0 ? (
                    <span className="font-semibold text-primary">{client.services[0].upfrontPaymentMethod || "Aucune"}</span>
                ) : (
                    <span className="font-semibold text-primary">Aucune</span>
                )}
            </TableCell>

            <TableCell>
                {isEditing ? (
                    <Input value={editedClient?.phoneNumber || ""} onChange={handlePhoneNumberChange} />
                ) : (
                    client.phoneNumber
                )}
            </TableCell>

            <TableCell>
                {isEditing ? (
                    <Input value={editedClient?.responsable || ""} onChange={handleResponsableChange} />
                ) : (
                    client.responsable
                )}
            </TableCell>

            <TableCell>{displayDate}</TableCell>
            <TableCell>{totalRemainingPayment.toLocaleString()} MRU</TableCell>
            <TableCell>{(client.totalPrice || 0).toLocaleString()} MRU</TableCell>

            <TableCell>
                {isEditing ? (
                    <div className="flex space-x-2">
                        <Button onClick={() => onSave(client._id!.toString())} size="sm" disabled={loading}>
                            {loading ? <BeatLoader color="#ffffff" size={5} /> : <Check className="h-4 w-4" color="white" />}
                        </Button>
                        <Button onClick={() => onEdit(null)} variant="outline" size="sm">
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                ) : (
                    <div className="flex space-x-2">
                        <Button onClick={() => onEdit(client)} size="sm">
                            <Edit className="h-4 w-4" color="white" />
                        </Button>
                        <Button className="text-white" onClick={() => onEditClientPage(client._id!.toString())} size="sm">
                            Éditer
                        </Button>
                        <Button onClick={() => onDelete(client._id!.toString())} variant="destructive" size="sm">
                            {client._id && deletingId === client._id.toString() ? (
                                <BeatLoader color="#ffffff" size={4} />
                            ) : (
                                <Trash className="h-4 w-4" color="white" />
                            )}
                        </Button>
                        <Button onClick={() => onCheckout(client._id!.toString())} size="sm">
                            <CheckCircle className="h-4 w-4" color="white" />
                        </Button>
                    </div>
                )}
            </TableCell>
        </TableRow>
    );
};