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
    onRemoveService: (index: number) => void;
}

export function ServiceTable({ services, onEditService, onRemoveService }: ServiceTableProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedServiceIndex, setSelectedServiceIndex] = useState<number | null>(null);

    const handleDeleteClick = (index: number) => {
        setSelectedServiceIndex(index);
        setIsModalOpen(true);
    };

    const handleConfirmDelete = () => {
        if (selectedServiceIndex !== null) {
            onRemoveService(selectedServiceIndex);
            setIsModalOpen(false);
            toast.success("Service deleted successfully!");
        }
    };

    const handleCancelDelete = () => {
        setIsModalOpen(false);
    };

    // Calculate remaining payment and total
    const totalRemainingPayment = services.reduce((sum, service) => {
        if (service.remainingPaymentMethod !== "") {
            return sum;
        }
        return sum + service.remainingPayment;
    }, 0);

    return (
        <div className="bg-white rounded-md shadow-md md:p-4 mx-auto"> {/* Container styles */}
            <Label className="text-primary text-md">Services Table</Label>
            <Table>
                <TableHeader className="bg-primary">
                    <TableRow className="hover:bg-primary">
                        <TableHead className="text-white">Service</TableHead>
                        <TableHead className="text-white">Montant</TableHead>
                        <TableHead className="text-white">Montant Avancé</TableHead>
                        <TableHead className="text-white">Montant Restant</TableHead>
                        <TableHead className="text-white">État de Paiement</TableHead>
                        <TableHead className="text-white">Début de Service</TableHead>
                        <TableHead className="text-white">Fin de Service</TableHead>
                        <TableHead className="text-white">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {services.map((service, index) => (
                        <TableRow key={index}>
                            <TableCell>{service.name}</TableCell>
                            <TableCell>{service.price.toLocaleString()} MRU</TableCell>
                            <TableCell>
                                {service.upfrontPayment.toLocaleString()} MRU
                                <div className="text-xs font-bold text-primary">{service.upfrontPaymentMethod || ""}</div>
                            </TableCell>
                            <TableCell>
                                {service.remainingPayment.toLocaleString()} MRU
                                <div className="text-xs font-bold text-primary">{service.remainingPaymentMethod || ""}</div>
                            </TableCell>
                            <TableCell className="text-center">
                                <span className={`${service.remainingPaymentMethod || service.upfrontPayment === service.price ? "bg-green-500 text-xs text-white py-2 px-8 rounded-xl" : "bg-gray-500 text-xs text-white py-2 px-8 rounded-xl"}`}>
                                    {service.remainingPaymentMethod || service.upfrontPayment === service.price ? "Payé" : "En Attente"}
                                </span>
                            </TableCell>
                            <TableCell>{formatDate(service.startDate)}</TableCell>
                            <TableCell>{formatDate(service.endDate)}</TableCell>
                            <TableCell>
                                <div className="flex items-center">
                                    <Button type="button" onClick={() => onEditService(index)} className="text-white">
                                        <Edit className="h-4 w-4" />
                                    </Button>
                                    <Button type="button" onClick={() => handleDeleteClick(index)} className="text-white ml-2 bg-red-500 hover:bg-red-600">
                                        <Trash className="h-4 w-4" />
                                    </Button>
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            <div className="mt-2 max-w-md bg-gray-100 p-4 rounded-md shadow-sm">
                <div className="flex justify-between">
                    <span className="text-primary font-semibold">Montant restant:</span>
                    <span className="font-medium text-gray-600">{totalRemainingPayment.toLocaleString()} MRU</span>
                </div>
                <div className="flex justify-between mt-1">
                    <span className="text-primary font-semibold">Montant total:</span>
                    <span className="font-medium text-gray-600">{services.reduce((sum, service) => sum + service.price, 0).toLocaleString()} MRU</span>
                </div>
            </div>
            <ConfirmationModal
                isOpen={isModalOpen}
                onConfirm={handleConfirmDelete}
                onCancel={handleCancelDelete}
                title="Confirmer la suppression"
                message="Êtes-vous sûr de vouloir supprimer ce service ?"
            />
        </div>
    );
}