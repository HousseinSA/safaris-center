"use client";
import { TableRow, TableCell } from "@/components/ui/table";
import { ExpenseRow } from "./ExpenseRow";
import { Expense } from "@/lib/types";

interface ExpenseGroupProps {
    monthYear: string;
    expenses: Expense[];
    total: number; // Total for the month
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
    total,
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
            {/* Month Header */}
            <TableRow className="bg-gray-100">
                <TableCell colSpan={6} className="font-bold text-primary capitalize text-lg">
                    {monthYear}
                </TableCell>
            </TableRow>

            {/* Expense Rows */}
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

            <TableRow>
                <TableCell colSpan={6}>
                    <div className="p-3 bg-gray-50  rounded-md shadow-sm">
                        <div className="flex justify-between">
                            <span className="font-bold text-primary text-lg">{`Total pour ${monthYear}:`}</span>
                            <span className="text-gray-600 font-medium text-lg">{total.toLocaleString()} MRU</span>
                        </div>
                    </div>
                </TableCell>
            </TableRow>
        </>
    );
};