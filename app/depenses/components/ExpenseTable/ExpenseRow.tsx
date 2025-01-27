"use client";

import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, Trash, Check, X } from "lucide-react";
import { BeatLoader } from "react-spinners";
import { Expense } from "@/lib/types";
import { Input } from "@/components/ui/input";
import formatDate from "@/lib/formatDate";
import { paymentMethods } from "@/lib/servicesPaymentData";
import React, { useState } from "react";
import { ConfirmationModal } from "@/components/ConfirmationModal"; // Import the modal

interface ExpenseRowProps {
    expense: Expense;
    editingId: string | null;
    formData: Expense;
    onEdit: (expense: Expense) => void;
    onDelete: (id: string) => void;
    onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
    onSubmit: (e: React.FormEvent) => void;
    onCancelEdit: () => void;
    deletingId: string | null;
}

export const ExpenseRow = ({
    expense,
    editingId,
    formData,
    onEdit,
    onDelete,
    onInputChange,
    onSubmit,
    onCancelEdit,
    deletingId,
}: ExpenseRowProps) => {
    const isEditing = editingId === expense._id;
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false); // Modal state

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await onSubmit(e);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteClick = () => {
        setIsModalOpen(true); // Open the modal
    };

    const handleConfirmDelete = () => {
        setIsModalOpen(false); // Close the modal
        onDelete(expense._id!.toString()); // Trigger the delete function
    };

    const handleCancelDelete = () => {
        setIsModalOpen(false); // Close the modal without deleting
    };

    return (
        <TableRow key={String(expense._id)}>
            <TableCell>
                {isEditing ? (
                    <Input
                        name="name"
                        value={formData.name}
                        onChange={onInputChange}
                    />
                ) : (
                    expense.name
                )}
            </TableCell>
            <TableCell>
                {isEditing ? (
                    <Input
                        name="price"
                        type="number"
                        value={formData.price}
                        onChange={onInputChange}
                        min="0"
                    />
                ) : (
                    `${expense.price} MRU`
                )}
            </TableCell>
            <TableCell>
                {isEditing ? (
                    <Input
                        name="responsable"
                        value={formData.responsable}
                        onChange={onInputChange}
                    />
                ) : (
                    expense.responsable
                )}
            </TableCell>
            <TableCell>
                {isEditing ? (
                    <Input
                        name="date"
                        type="date"
                        value={formData.date}
                        onChange={onInputChange}
                        min={new Date().toISOString().split("T")[0]}
                    />
                ) : (
                    formatDate(expense.date)
                )}
            </TableCell>
            <TableCell>
                {isEditing ? (
                    <select
                        name="paymentMethod"
                        value={formData.paymentMethod}
                        onChange={onInputChange}
                        className="p-2 border rounded"
                    >
                        {paymentMethods.map((method, index) => (
                            <option key={index} value={method}>
                                {method}
                            </option>
                        ))}
                    </select>
                ) : (
                    expense.paymentMethod
                )}
            </TableCell>
            <TableCell>
                {isEditing ? (
                    <div className="flex space-x-2">
                        <Button
                            onClick={handleSubmit}
                            size="sm"
                            className="text-white"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <BeatLoader color="#ffffff" size={4} />
                            ) : (
                                <Check className="h-4 w-4" />
                            )}
                        </Button>
                        <Button onClick={onCancelEdit} size="sm" variant="outline">
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                ) : (
                    <div className="flex space-x-2">
                        <Button onClick={() => onEdit(expense)} size="sm" className="text-white">
                            <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                            onClick={handleDeleteClick} // Open the modal on delete click
                            size="sm"
                            variant="destructive"
                            disabled={deletingId === expense._id}
                        >
                            {deletingId === expense._id ? (
                                <BeatLoader color="#ffffff" size={4} />
                            ) : (
                                <Trash className="h-4 w-4" />
                            )}
                        </Button>
                    </div>
                )}
            </TableCell>

            {/* Confirmation Modal */}
            <ConfirmationModal
                isOpen={isModalOpen}
                onConfirm={handleConfirmDelete}
                onCancel={handleCancelDelete}
                title="Confirmer la suppression"
                message="Êtes-vous sûr de vouloir supprimer cette dépense ?
"
            />
        </TableRow>
    );
};