"use client";
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
                        className={`p-1 ${index < client.services.length - 1 ? "border-b border-primary" : ""
                            }`}
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
                        className={`p-1 ${index < client.services.length - 1 ? "border-b border-primary" : ""
                            }`}
                    >
                        {(service.upfrontPayment || 0).toLocaleString()} MRU
                    </div>
                ))}
            </TableCell>

            <TableCell>
                {isEditing ? (
                    <select
                        value={editedClient?.paymentMethod || ""}
                        onChange={(e) =>
                            setEditedClient({
                                ...editedClient!,
                                paymentMethod: e.target.value,
                            })
                        }
                        className="w-full p-2 border rounded"
                    >
                        <option value="Cash">Cash</option>
                        <option value="Bankily">Bankily</option>
                        <option value="Masrivi">Masrivi</option>
                        <option value="Sedad">Sedad</option>
                        <option value="Click">Click</option>
                    </select>
                ) : (
                    client.paymentMethod
                )}
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
            <TableCell>{(client.remainingTotal || 0).toLocaleString()} MRU</TableCell>
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
                            onClick={() => onEdit(null)} // Pass null to exit edit mode
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
                            onClick={() => client._id && onDelete(client._id.toString())}
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
                            className="text-white"
                            onClick={() => client._id && onEditClientPage(client._id.toString())}
                            size="sm"
                        >
                            Éditer
                        </Button>
                        <Button
                            onClick={() => client._id && onCheckout(client._id.toString())}
                            size="sm"
                        >
                            <CheckCircle className="h-4 w-4" color="white" />
                        </Button>
                    </div>
                )}
            </TableCell>
        </TableRow>
    );
};