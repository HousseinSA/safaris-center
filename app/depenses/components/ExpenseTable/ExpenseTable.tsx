"use client";
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ExpenseGroup } from "./ExpenseGroup";
import { Expense } from "@/lib/types";

interface ExpenseTableProps {
    groupedExpenses: { [key: string]: { expenses: Expense[]; total: number } };
    editingId: string | null;
    formData: Expense;
    onEdit: (expense: Expense) => void;
    onDelete: (id: string) => void;
    onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
    onSubmit: (e: React.FormEvent) => void;
    onCancelEdit: () => void;
    deletingId: string | null;
    onDeleteClick: (id: string) => void;
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
    onDeleteClick,
}: ExpenseTableProps) => {
    return (
        <Table>
            <TableHeader className="bg-primary">
                <TableRow className="text-white hover:bg-primary">
                    <TableHead className="text-white">Nom de la Dépense</TableHead>
                    <TableHead className="text-white">Dépense Montant</TableHead>
                    <TableHead className="text-white">Responsable</TableHead>
                    <TableHead className="text-white">Date de la Dépense</TableHead>
                    <TableHead className="text-white">Méthode de Paiement</TableHead>
                    <TableHead className="text-white">Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {Object.entries(groupedExpenses).map(([monthYear, { expenses, total }]) => (
                    <ExpenseGroup
                        key={monthYear}
                        monthYear={monthYear}
                        expenses={expenses}
                        total={total}
                        editingId={editingId}
                        formData={formData}
                        onEdit={onEdit}
                        onDelete={onDelete}
                        onInputChange={onInputChange}
                        onSubmit={onSubmit}
                        onCancelEdit={onCancelEdit}
                        deletingId={deletingId}
                        onDeleteClick={onDeleteClick}
                    />
                ))}
            </TableBody>
        </Table>
    );
};