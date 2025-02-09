'use client'
import { ExpenseForm } from "./ExpenseForm";
import { ExpenseTable } from "./ExpenseTable/ExpenseTable";
import { TotalExpenses } from "./TotalExpenses";
import { Button } from "@/components/ui/button";
import { Plus, Undo2, Users } from "lucide-react";
import Link from "next/link";
import { AnimatePresence } from "framer-motion";
import { Pagination } from "@/components/clientTable/Pagination";
import { useExpenses } from "./hooks/useExpenses";


export default function ExpensePage() {
    const {
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
        handleDelete,
        handleEdit,
        handleCancelEdit,
        totalExpenses,
    } = useExpenses();

    return (
        <div className="md:p-6">
            <div className="flex justify-between mb-4 items-center">
                <h2 className="text-xl font-bold text-primary">Dépenses</h2>
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
                        groupedExpenses={currentGroupedExpenses}
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