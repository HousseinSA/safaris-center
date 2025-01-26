"use client";

import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ExpenseGroup } from "./ExpenseGroup";
import { Expense } from "@/lib/types";

interface ExpenseTableProps {
    groupedExpenses: { [key: string]: Expense[] };
    editingId: string | null;
    formData: Expense;
    onEdit: (expense: Expense) => void;
    onDelete: (id: string) => void;
    onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
    onSubmit: (e: React.FormEvent) => void;
    onCancelEdit: () => void;
    deletingId: string | null;
}

export const ExpenseTable = ({
    groupedExpenses,
    editingId,
    formData,
    onEdit,
    onDelete,
    onInputChange,
    onSubmit,
    onCancelEdit,
    deletingId,
}: ExpenseTableProps) => {
    return (
        <Table>
            <TableHeader className="bg-primary">
                <TableRow>
                    <TableHead className="text-white">Nom de la Dépense</TableHead>
                    <TableHead className="text-white"> Dépense Montant</TableHead>
                    <TableHead className="text-white">Responsable</TableHead>
                    <TableHead className="text-white">Date de la Dépense</TableHead>
                    <TableHead className="text-white">Méthode de Paiement</TableHead>
                    <TableHead className="text-white">Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {Object.entries(groupedExpenses).map(([monthYear, expenses]) => (
                    <ExpenseGroup
                        key={monthYear}
                        monthYear={monthYear}
                        expenses={expenses}
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
            </TableBody>
        </Table>
    );
};