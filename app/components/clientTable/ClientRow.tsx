"use client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Edit, Trash, Check, X, CheckCircle } from "lucide-react";
import { BeatLoader } from "react-spinners";
import { Client } from "@/lib/types";
import formatDate from "@/lib/formatDate";
import { TableCell, TableRow } from "../ui/table";
import { ConfirmationModal } from "@/components/ConfirmationModal";
import { useState } from "react";

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
    const [isModalOpen, setIsModalOpen] = useState(false); // Modal state

    const handleDeleteClick = () => {
        setIsModalOpen(true); // Open the modal
    };

    const handleConfirmDelete = () => {
        setIsModalOpen(false); // Close the modal
        if (client._id) {
            onDelete(client._id.toString()); // Trigger the delete function
        }
    };

    const handleCancelDelete = () => {
        setIsModalOpen(false); // Close the modal without deleting
    };

    // Calculate total remaining payment based on services
    const totalRemainingPayment = client.services.reduce((sum, service) => {
        if (service.remainingPaymentMethod) {
            return sum; // Do not add anything as the payment is fulfilled
        }
        return sum + service.remainingPayment; // Add up remaining payments
    }, 0);

    return (
        <TableRow key={client._id?.toString()}>
            <TableCell>
                {isEditing ? (
                    <Input
                        value={editedClient?.name || ""}
                        onChange={(e) => {
                            const value = e.target.value;
                            if (/^[A-Za-z\s]*$/.test(value)) {
                                setEditedClient({
                                    ...editedClient!,
                                    name: value,
                                });
                            }
                        }}
                    />
                ) : (
                    client.name
                )}
            </TableCell>

            <TableCell>
                {client.services.map((service, index) => (
                    <div
                        key={index}
                        className={`p-1 ${index < client.services.length - 1 ? "border-b border-primary" : ""}`}
                    >
                        <span className="font-semibold">{service.name}:</span>{" "}
                        {(service.price || 0).toLocaleString()} MRU
                    </div>
                ))}
            </TableCell>

            <TableCell>
                {client.services.map((service, index) => (
                    <div
                        key={index}
                        className={`p-1 ${index < client.services.length - 1 ? "border-b border-primary" : ""}`}
                    >
                        {(service.upfrontPayment || 0).toLocaleString()} MRU
                    </div>
                ))}
            </TableCell>

            <TableCell>
                {client.services.map((service, index) => {
                    const isFullPayment = service.upfrontPayment >= service.price;
                    return (
                        <div key={index}>
                            {isFullPayment ? (
                                <span className="font-semibold text-primary">{service.upfrontPaymentMethod}</span>
                            ) : (
                                <span className="font-semibold text-primary">
                                    {service.upfrontPaymentMethod} <span className="text-gray-400 font-bold">/</span>  {service.remainingPaymentMethod || "N/A"}
                                </span>
                            )}
                        </div>
                    );
                })}
            </TableCell>

            <TableCell>
                {isEditing ? (
                    <Input
                        value={editedClient?.phoneNumber || ""}
                        onChange={(e) => {
                            const value = e.target.value;
                            if (/^\d*$/.test(value) && value.length <= 8) {
                                setEditedClient({
                                    ...editedClient!,
                                    phoneNumber: value,
                                });
                            }
                        }}
                    />
                ) : (
                    client.phoneNumber
                )}
            </TableCell>

            <TableCell>
                {isEditing ? (
                    <Input
                        value={editedClient?.responsable || ""}
                        onChange={(e) => {
                            const value = e.target.value;
                            if (/^[A-Za-z\s]*$/.test(value)) {
                                setEditedClient({
                                    ...editedClient!,
                                    responsable: value,
                                });
                            }
                        }}
                    />
                ) : (
                    client.responsable
                )}
            </TableCell>

            <TableCell>{formatDate(client.dateOfBooking)}</TableCell>
            <TableCell>{totalRemainingPayment.toLocaleString()} MRU</TableCell>
            <TableCell>{(client.totalPrice || 0).toLocaleString()} MRU</TableCell>

            <TableCell>
                {isEditing ? (
                    <div className="flex space-x-2">
                        <Button
                            onClick={() => onSave(client._id!.toString())}
                            size="sm"
                            disabled={loading}
                        >
                            {loading ? (
                                <BeatLoader color="#ffffff" size={5} />
                            ) : (
                                <Check className="h-4 w-4" color="white" />
                            )}
                        </Button>
                        <Button
                            onClick={() => onEdit(null)}
                            variant="outline"
                            size="sm"
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                ) : (
                    <div className="flex space-x-2">
                        <Button onClick={() => onEdit(client)} size="sm">
                            <Edit className="h-4 w-4" color="white" />
                        </Button>
                        <Button
                            className="text-white"
                            onClick={() => client._id && onEditClientPage(client._id.toString())}
                            size="sm"
                        >
                            Éditer
                        </Button>
                        <Button
                            onClick={handleDeleteClick}
                            variant="destructive"
                            size="sm"
                        >
                            {client._id && deletingId === client._id.toString() ? (
                                <BeatLoader color="#ffffff" size={4} />
                            ) : (
                                <Trash className="h-4 w-4" color="white" />
                            )}
                        </Button>
                        <Button
                            onClick={() => {
                                if (client._id) {
                                    onCheckout(client._id.toString());
                                }
                            }}
                            size="sm"
                        >
                            <CheckCircle className="h-4 w-4" color="white" />
                        </Button>
                    </div>
                )}
            </TableCell>
            <ConfirmationModal
                isOpen={isModalOpen}
                onConfirm={handleConfirmDelete}
                onCancel={handleCancelDelete}
                title="Confirmer la suppression"
                message="Êtes-vous sûr de vouloir supprimer ce client ?"
            />
        </TableRow>
    );
};