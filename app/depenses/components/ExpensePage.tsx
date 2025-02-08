"use client";

import { useState, useEffect } from "react";
import { ExpenseForm } from "./ExpenseForm";
import { ExpenseTable } from "./ExpenseTable/ExpenseTable";
import { TotalExpenses } from "./TotalExpenses";
import { Expense } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Plus, Undo2, Users } from "lucide-react";
import Link from "next/link";
import { AnimatePresence } from "framer-motion";
import { Pagination } from "@/components/clientTable/Pagination";
import { showToast } from "@/lib/showToast";


export default function ExpensePage() {
    const [expenses, setExpenses] = useState<Expense[]>([]);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [formData, setFormData] = useState<Expense>({
        _id: "",
        name: "",
        price: 0,
        responsable: "",
        date: new Date().toISOString().split("T")[0],
        paymentMethod: "Cash",
    });
    const [loading, setLoading] = useState(false);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const expensesPerPage = 15;

    useEffect(() => {
        fetchExpenses();
    }, []);

    const fetchExpenses = async () => {
        const response = await fetch("/api/expenses");
        const data: Expense[] = await response.json();
        setExpenses(data);
    };

    // Pagination logic
    const indexOfLastExpense = currentPage * expensesPerPage;
    const indexOfFirstExpense = indexOfLastExpense - expensesPerPage;
    const currentExpenses = expenses.slice(indexOfFirstExpense, indexOfLastExpense);

    // Group the sliced expenses by month and year
    // Group the sliced expenses by month and year and calculate the total for each month
    const groupedExpenses = currentExpenses.reduce((acc: { [key: string]: { expenses: Expense[]; total: number } }, expense) => {
        const date = new Date(expense.date);
        const monthYear = `${date.toLocaleString("fr-FR", { month: "long" })} ${date.getFullYear()}`;
        if (!acc[monthYear]) {
            acc[monthYear] = { expenses: [], total: 0 };
        }
        const price = Number(expense.price);
        if (!isNaN(price)) {
            acc[monthYear].total += price;
        }
        acc[monthYear].expenses.push(expense);
        return acc;
    }, {});

    // Total pages
    const totalPages = Math.ceil(expenses.length / expensesPerPage);

    // Handle next page
    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    // Handle previous page
    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        if (name === "price" && parseFloat(value) < 0) return;
        setFormData({ ...formData, [name]: name === "price" ? parseFloat(value) : value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const url = editingId ? `/api/expenses?id=${editingId}` : "/api/expenses";
        const method = editingId ? "PUT" : "POST";

        try {
            const payload = editingId ? formData : { ...formData, _id: undefined };

            const response = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (response.ok) {
                fetchExpenses();
                setFormData({ _id: "", name: "", price: 0, responsable: "", date: new Date().toISOString().split("T")[0], paymentMethod: "" });
                setEditingId(null);
                setShowForm(false);

                showToast("success", editingId ? "Dépense modifiée avec succès!" : "Dépense créée avec succès!");
            } else {
                throw new Error("Failed to save expense");
            }
        } catch (error) {
            console.error("Error submitting expense:", error);
            showToast("error", "Erreur lors de la sauvegarde de la dépense");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        setDeletingId(id);
        try {
            const response = await fetch(`/api/expenses?id=${id}`, { method: "DELETE" });
            if (!response.ok) {
                throw new Error("Failed to delete expense");
            }
            fetchExpenses();
            showToast("success", "Dépense supprimée avec succès!");
        } catch (error) {
            console.error("Error deleting expense:", error);
            showToast("error", "Erreur lors de la suppression de la dépense");
        } finally {
            setDeletingId(null);
        }
    };

    const handleEdit = (expense: Expense) => {
        setFormData(expense);
        setEditingId(expense._id ? String(expense._id) : null);
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        setFormData({ _id: "", name: "", price: 0, responsable: "", date: new Date().toISOString().split("T")[0], paymentMethod: "" });
    };

    const totalExpenses = expenses.reduce((total, expense) => {
        const price = Number(expense.price);
        if (isNaN(price)) {
            console.warn("Invalid price found for expense:", expense);
            return total;
        }
        return total + price;
    }, 0);

    return (
        <div className="md:p-6">
            <div className="flex justify-between mb-4 items-center">
                <h2 className="text-xl font-bold  text-primary">Dépenses</h2>
                <Link href={'/'}>
                    <Button className="bg-primary text-white hover:bg-primary-dark flex items-center space-x-2">
                        <Users className="h-4 w-4" />
                        <span className="hidden md:inline-block">Retour à la liste des clients</span>
                    </Button>
                </Link>
            </div>

            <div className="flex items-center space-x-4 mb-4">
                <Button onClick={() => setShowForm(!showForm)} className="text-white" disabled={editingId !== null}>
                    {showForm ? <Undo2 className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                    {showForm ? "Annuler" : "Ajouter une dépense"}
                </Button>
            </div>
            <AnimatePresence>
                {showForm && (
                    <ExpenseForm
                        formData={formData}
                        editingId={editingId}
                        loading={loading}
                        onSubmit={handleSubmit}
                        onInputChange={handleInputChange}
                        onCancel={handleCancelEdit}
                    />
                )}
            </AnimatePresence>

            {expenses.length > 0 ? (
                <>
                    <ExpenseTable
                        groupedExpenses={groupedExpenses}
                        editingId={editingId}
                        formData={formData}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        onInputChange={handleInputChange}
                        onSubmit={handleSubmit}
                        onCancelEdit={handleCancelEdit}
                        deletingId={deletingId}
                    />
                    <TotalExpenses totalExpenses={totalExpenses} />

                    {expenses.length > expensesPerPage && (
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            indexOfFirstClient={indexOfFirstExpense}
                            indexOfLastClient={indexOfLastExpense}
                            clientsLength={expenses.length}
                            onNextPage={handleNextPage}
                            onPreviousPage={handlePreviousPage}
                        />
                    )}
                </>
            ) : (
                <p className="text-gray-500">Aucune dépense trouvée.</p>
            )}
        </div>
    );
}