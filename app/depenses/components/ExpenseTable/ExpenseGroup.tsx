"use client";

import { TableRow, TableCell } from "@/components/ui/table";
import { ExpenseRow } from "./ExpenseRow";
import { Expense } from "@/lib/types";

interface ExpenseGroupProps {
    monthYear: string;
    expenses: Expense[];
    editingId: string | null;
    formData: Expense;
    onEdit: (expense: Expense) => void;
    onDelete: (id: string) => void;
    onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
    onSubmit: (e: React.FormEvent) => void;
    onCancelEdit: () => void;
    deletingId: string | null;
}

export const ExpenseGroup = ({
    monthYear,
    expenses,
    editingId,
    formData,
    onEdit,
    onDelete,
    onInputChange,
    onSubmit,
    onCancelEdit,
    deletingId,
}: ExpenseGroupProps) => {
    return (
        <>
            <TableRow className="bg-gray-100">
                <TableCell colSpan={6} className="font-bold text-primary capitalize">
                    {monthYear}
                </TableCell>
            </TableRow>
            {expenses.map((expense) => (
                <ExpenseRow
                    key={String(expense._id)}
                    expense={expense}
                    editingId={editingId}
                    formData={formData}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    onInputChange={onInputChange}
                    onSubmit={onSubmit}
                    onCancelEdit={onCancelEdit}
                    deletingId={deletingId}
                />
            ))}
        </>
    );
};