import { useState, useEffect, useCallback } from "react";
import { Expense } from "@/lib/types";
import { showToast } from "@/lib/showToast";

export const useExpenses = () => {
    // State Management
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
    const [groupedExpenses, setGroupedExpenses] = useState<{ [key: string]: { expenses: Expense[]; total: number } }>({});
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedExpenseId, setSelectedExpenseId] = useState<string | null>(null);

    // Pagination start count 
    const expensesPerPage = 20;

    // Group Expenses by Month
    const groupExpensesByMonth = useCallback((expenses: Expense[]) => {
        const grouped = expenses.reduce((acc, expense) => {
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
        }, {} as { [key: string]: { expenses: Expense[]; total: number } });

        setGroupedExpenses(grouped);
    }, []);

    // Fetch Expenses
    const fetchExpenses = useCallback(async () => {
        try {
            const response = await fetch("/api/expenses");
            const data: Expense[] = await response.json();
            setExpenses(data);
            groupExpensesByMonth(data);
        } catch (error) {
            console.error("Error fetching expenses:", error);
            showToast("error", "Erreur lors du chargement des dépenses");
        }
    }, [groupExpensesByMonth]);

    useEffect(() => {
        fetchExpenses();
    }, [fetchExpenses]);

    // Pagination Logic
    const allExpenses = Object.values(groupedExpenses).flatMap(group => group.expenses);
    const indexOfLastExpense = currentPage * expensesPerPage;
    const indexOfFirstExpense = indexOfLastExpense - expensesPerPage;
    const currentExpenses = allExpenses.slice(indexOfFirstExpense, indexOfLastExpense);

    const currentGroupedExpenses = currentExpenses.reduce((acc, expense) => {
        const date = new Date(expense.date);
        const monthYear = `${date.toLocaleString("fr-FR", { month: "long" })} ${date.getFullYear()}`;
        if (!acc[monthYear]) {
            acc[monthYear] = { expenses: [], total: 0 };
        }
        acc[monthYear].expenses.push(expense);
        acc[monthYear].total = groupedExpenses[monthYear]?.total || 0;
        return acc;
    }, {} as { [key: string]: { expenses: Expense[]; total: number } });

    const totalPages = Math.ceil(allExpenses.length / expensesPerPage);

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    // Form Handling
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
            const [year, month, day] = formData.date.split("-").map(Number);
            const currentTime = new Date();
            const expenseDate = new Date(year, month - 1, day, currentTime.getHours(), currentTime.getMinutes());

            const payload = {
                ...formData,
                date: expenseDate.toISOString(),
            };

            if (!editingId) {
                delete payload._id;
            }

            const response = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (response.ok) {
                fetchExpenses();
                setFormData({
                    _id: "",
                    name: "",
                    price: 0,
                    responsable: "",
                    date: new Date().toISOString().split("T")[0],
                    paymentMethod: "Cash",
                });
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

    // Delete Handling
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

    // Edit Handling
    const handleEdit = (expense: Expense) => {
        setFormData(expense);
        setEditingId(expense._id ? String(expense._id) : null);
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        setFormData({
            _id: "",
            name: "",
            price: 0,
            responsable: "",
            date: new Date().toISOString().split("T")[0],
            paymentMethod: "Cash",
        });
    };

    // Confirmation Modal
    const handleDeleteClick = (id: string) => {
        setSelectedExpenseId(id);
        setIsModalOpen(true);
    };

    const handleConfirmDelete = () => {
        if (selectedExpenseId) {
            handleDelete(selectedExpenseId);
        }
        setIsModalOpen(false);
    };

    const handleCancelDelete = () => {
        setIsModalOpen(false);
    };

    // Total Expenses Calculation
    const totalExpenses = allExpenses.reduce((total, expense) => {
        const price = Number(expense.price);
        return isNaN(price) ? total : total + price;
    }, 0);

    return {
        expenses,
        showForm,
        setShowForm,
        editingId,
        formData,
        loading,
        deletingId,
        currentPage,
        expensesPerPage,
        currentGroupedExpenses,
        totalPages,
        indexOfFirstExpense,
        indexOfLastExpense,
        handleNextPage,
        handlePreviousPage,
        handleInputChange,
        handleSubmit,
        handleEdit,
        handleCancelEdit,
        totalExpenses,
        isModalOpen,
        handleCancelDelete,
        handleConfirmDelete,
        handleDeleteClick,
    };
};