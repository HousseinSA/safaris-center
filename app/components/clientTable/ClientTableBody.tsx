"use client";
import { Client } from "@/lib/types";
import {
    Table,
    TableBody,
    TableHead,
    TableHeader,
    TableRow,
    TableCell,
} from "@/components/ui/table";
import { ClientRow } from "./ClientRow";
import React from "react";

interface ClientTableBodyProps {
    groupedClients: { [key: string]: Client[] };
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

export const ClientTableBody = ({
    groupedClients,
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
}: ClientTableBodyProps) => {
    return (
        <Table>
            <TableHeader className="bg-primary ">
                <TableRow className="text-white hover:bg-primary">
                    <TableHead className="text-white">Nom du client</TableHead>
                    <TableHead className="text-white">Services</TableHead>
                    <TableHead className="text-white">Montant avancé</TableHead>
                    <TableHead className="text-white">Méthode de paiement</TableHead>
                    <TableHead className="text-white">Numéro de téléphone</TableHead>
                    <TableHead className="text-white">Responsable</TableHead>
                    <TableHead className="text-white">Date de réservation</TableHead>
                    <TableHead className="text-white">Montant Restant</TableHead>
                    <TableHead className="text-white">Total Montant</TableHead>
                    <TableHead className="text-white">Actions</TableHead>
                </TableRow>
            </TableHeader>

            <TableBody>
                {Object.entries(groupedClients).map(([monthYear, clients], index) => (
                    <React.Fragment key={index}>
                        <TableRow key={monthYear} className="bg-gray-100">
                            <TableCell colSpan={10} className="font-bold text-primary capitalize">
                                {monthYear}
                            </TableCell>
                        </TableRow>
                        {clients.map((client) => (
                            <ClientRow
                                key={client._id?.toString()}
                                client={client}
                                editingId={editingId}
                                editedClient={editedClient}
                                loading={loading}
                                deletingId={deletingId}
                                onEdit={onEdit}
                                onSave={onSave}
                                onDelete={onDelete}
                                onEditClientPage={onEditClientPage}
                                onCheckout={onCheckout}
                                setEditedClient={setEditedClient}
                            />
                        ))}
                    </React.Fragment>
                ))}
            </TableBody>
        </Table>
    );
};