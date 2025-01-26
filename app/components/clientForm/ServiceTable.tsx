"use client";

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
import formatDate from '@/lib/formatDate'

interface ServiceTableProps {
    services: Service[];
    onEditService: (index: number) => void;
    onRemoveService: (index: number) => void;
}

export function ServiceTable({ services, onEditService, onRemoveService }: ServiceTableProps) {


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
                                <Button
                                    type="button"
                                    onClick={() => onEditService(index)}
                                    className="text-white"
                                >
                                    <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                    type="button"
                                    onClick={() => onRemoveService(index)}
                                    className="text-white ml-2 bg-red-500"
                                >
                                    <Trash className="h-4 w-4" />
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            <div className="mt-2 text-right">
                <span className="text-primary font-semibold">Montant restant: </span>{" "}
                {services.reduce((sum, service) => sum + service.remainingPayment, 0).toLocaleString()} MRU
                <br />
                <span className="text-primary font-semibold">Montant total: </span>{" "}
                {services.reduce((sum, service) => sum + service.price, 0).toLocaleString()} MRU
            </div>
        </div>
    );
}