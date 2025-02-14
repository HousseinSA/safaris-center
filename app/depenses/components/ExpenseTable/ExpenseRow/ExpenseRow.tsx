"use client";
import React, { useState } from "react";


import { TableCell, TableRow } from "@/components/ui/table";
import { Expense } from "@/lib/types";
import { Input } from "@/components/ui/input";
import formatDate from "@/lib/formatDate";
import { paymentMethods } from "@/lib/servicesPaymentData";
import { ActionButtons } from "./ActionButton";

interface ExpenseRowProps {
    expense: Expense;
    editingId: string | null;
    formData: Expense;
    onEdit: (expense: Expense) => void;
    onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
    onSubmit: (e: React.FormEvent) => void;
    onCancelEdit: () => void;
    deletingId: string | null;
    onDeleteClick: (id: string) => void;
}

const EditableCell = ({ name, value, type = "text", onChange, min }: {
    name: string;
    value: string | number | Date;
    type?: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
    min?: string;
}) => (
    <Input
        name={name}
        type={type}
        value={typeof value === "string" || typeof value === "number" ? value : value.toISOString().split("T")[0]}
        onChange={onChange}
        min={min}
        className="w-full"
    />
);

const DisplayCell = ({ value }: { value: string | number | Date }) => (
    <span>{String(value)}</span>
);



export const ExpenseRow = ({ expense, editingId, formData, onEdit, onInputChange, onSubmit, onCancelEdit, deletingId, onDeleteClick }: ExpenseRowProps) => {
    const isEditing = editingId === expense._id;
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await onSubmit(e);
        } finally {
            setIsSubmitting(false);
        }
    };



    const formattedDate = new Date(formData.date).toISOString().split("T")[0];

    return (
        <TableRow key={String(expense._id)}>
            {/* Name */}
            <TableCell>
                {isEditing ? (
                    <EditableCell name="name" value={formData.name} onChange={onInputChange} />
                ) : (
                    <DisplayCell value={expense.name} />
                )}
            </TableCell>

            {/* Price */}
            <TableCell>
                {isEditing ? (
                    <EditableCell name="price" type="number" value={formData.price} onChange={onInputChange} min="0" />
                ) : (
                    <DisplayCell value={`${expense.price.toLocaleString()} MRU`} />
                )}
            </TableCell>

            {/* Responsible */}
            <TableCell>
                {isEditing ? (
                    <EditableCell name="responsable" value={formData.responsable} onChange={onInputChange} />
                ) : (
                    <DisplayCell value={expense.responsable} />
                )}
            </TableCell>
            {/* Date */}
            <TableCell>
                {isEditing ? (
                    <EditableCell name="date" type="date" value={formattedDate} onChange={onInputChange} min={new Date().toISOString().split("T")[0]} />
                ) : (
                    <DisplayCell value={formatDate(expense.date)} />
                )}
            </TableCell>

            {/* Payment Method */}
            <TableCell>
                {isEditing ? (
                    <select name="paymentMethod" value={formData.paymentMethod} onChange={onInputChange} className="p-2 border rounded w-full">
                        {paymentMethods.map((method, index) => (
                            <option key={index} value={method}>{method}</option>
                        ))}
                    </select>
                ) : (
                    <DisplayCell value={expense.paymentMethod} />
                )}
            </TableCell>

            {/* Actions */}
            <TableCell>
                <ActionButtons
                    isEditing={isEditing}
                    onSubmit={handleSubmit}
                    onCancelEdit={onCancelEdit}
                    onEdit={onEdit}
                    onDeleteClick={onDeleteClick}
                    expense={expense}
                    deletingId={deletingId}
                    isSubmitting={isSubmitting}
                />
            </TableCell>
        </TableRow>
    );
};