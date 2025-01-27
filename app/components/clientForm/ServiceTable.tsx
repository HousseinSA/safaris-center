"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Trash, Edit } from "lucide-react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Service } from "@/lib/types";
import formatDate from '@/lib/formatDate';
import { ConfirmationModal } from "@/components/ConfirmationModal";
import toast from "react-hot-toast";

interface ServiceTableProps {
    services: Service[];
    onEditService: (index: number) => void;
    onRemoveService: (index: number) => void; // This should only delete the item, no redirection
}

export function ServiceTable({ services, onEditService, onRemoveService }: ServiceTableProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedServiceIndex, setSelectedServiceIndex] = useState<number | null>(null);

    // Open the modal and set the selected service index
    const handleDeleteClick = (index: number) => {
        setSelectedServiceIndex(index);
        setIsModalOpen(true);
    };

    // Confirm deletion and close the modal
    const handleConfirmDelete = () => {
        if (selectedServiceIndex !== null) {
            onRemoveService(selectedServiceIndex); // Trigger the delete function
            setIsModalOpen(false); // Close the modal
            toast.success("Service deleted successfully!"); // Show success toast message
        }
    };

    // Close the modal without deleting or performing any other action
    const handleCancelDelete = () => {
        setIsModalOpen(false); // Just hide the modal
    };

    return (
        <div>
            <Label className="text-primary">Services ajoutés</Label>
            <Table>
                <TableHeader className="bg-primary">
                    <TableRow>
                        <TableHead className="text-white">Service</TableHead>
                        <TableHead className="text-white">Montant</TableHead>
                        <TableHead className="text-white">Montant avancé</TableHead>
                        <TableHead className="text-white">Montant restant</TableHead>
                        <TableHead className="text-white">Début de service</TableHead>
                        <TableHead className="text-white">Fin de service</TableHead>
                        <TableHead className="text-white">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {services.map((service, index) => (
                        <TableRow key={index}>
                            <TableCell>{service.name}</TableCell>
                            <TableCell>{service.price.toLocaleString()} MRU</TableCell>
                            <TableCell>{service.upfrontPayment.toLocaleString()} MRU</TableCell>
                            <TableCell>{service.remainingPayment.toLocaleString()} MRU</TableCell>
                            <TableCell>{formatDate(service.startDate)}</TableCell>
                            <TableCell>{formatDate(service.endDate)}</TableCell>
                            <TableCell>
                                <div className="flex items-center">
                                    <Button
                                        type="button"
                                        onClick={() => onEditService(index)}
                                        className="text-white"
                                    >
                                        <Edit className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        type="button"
                                        onClick={() => handleDeleteClick(index)} // Open the modal on delete click
                                        className="text-white ml-2 bg-red-500 hover:bg-red-600"
                                    >
                                        <Trash className="h-4 w-4" />
                                    </Button>
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            <div className="mt-2 text-right">
                <span className="text-primary font-semibold">Montant restant: </span>
                {services.reduce((sum, service) => sum + service.remainingPayment, 0).toLocaleString()} MRU
                <br />
                <span className="text-primary font-semibold">Montant total: </span>
                {services.reduce((sum, service) => sum + service.price, 0).toLocaleString()} MRU
            </div>

            {/* Reusable Confirmation Modal */}
            <ConfirmationModal
                isOpen={isModalOpen}
                onConfirm={handleConfirmDelete}
                onCancel={handleCancelDelete}
                title="Confirmer la suppression
"
                message="Êtes-vous sûr de vouloir supprimer ce service ?
"
            />
        </div>
    );
}