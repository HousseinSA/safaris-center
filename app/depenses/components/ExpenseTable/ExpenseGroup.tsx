"use client";
import { TableRow, TableCell } from "@/components/ui/table";
import { ExpenseRow } from "./ExpenseRow";
import { Expense } from "@/lib/types";

interface ExpenseGroupProps {
    monthYear: string;
    expenses: Expense[];
    total: number;
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
            <TableRow className="bg-gray-100 border-b border-gray-200">
                <TableCell colSpan={6} className="font-bold text-primary capitalize text-md px-4 py-3">
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

            <TableRow className="border-t border-gray-200">
                <TableCell colSpan={6}>
                    <div className="p-3 bg-gray-50 rounded-md shadow-sm flex items-center justify-between  mt-2">
                        <span className="font-bold text-primary text-md">{`Total Dépenses ${monthYear}:`}</span>
                        <span className="text-gray-800 font-medium text-md bg-gray-100 px-4 py-2 rounded-md">
                            {total.toLocaleString()} MRU
                        </span>
                    </div>
                </TableCell>
            </TableRow>
        </>
    );
};