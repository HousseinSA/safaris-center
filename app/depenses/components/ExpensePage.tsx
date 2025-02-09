"use client";
import { ExpenseForm } from "./ExpenseForm";
import { ExpenseTable } from "./ExpenseTable/ExpenseTable";
import { TotalExpenses } from "./TotalExpenses";
import { Button } from "@/components/ui/button";
import { Plus, Undo2, Users } from "lucide-react";
import Link from "next/link";
import { AnimatePresence } from "framer-motion";
import { Pagination } from "@/components/clientTable/Pagination";
import { useExpenses } from "./hooks/useExpenses";
import { ConfirmationModal } from "@/components/ConfirmationModal";

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
        isModalOpen,
        handleDeleteClick,
        handleCancelDelete,
        handleConfirmDelete,
    } = useExpenses();

    // Header Section
    const renderHeader = () => (
        <div className="flex justify-between mb-4 items-center">
            <h2 className="text-xl font-bold text-primary">Dépenses</h2>
            <Link href="/">
                <Button className="bg-primary text-white hover:bg-primary-dark flex items-center space-x-2">
                    <Users className="h-4 w-4" />
                    <span className="hidden md:inline-block">Retour à la liste des clients</span>
                </Button>
            </Link>
        </div>
    );

    // Add/Edit Button
    const renderAddEditButton = () => (
        <div className="flex items-center space-x-4 mb-4">
            <Button
                onClick={() => setShowForm(!showForm)}
                className="text-white"
                disabled={editingId !== null}
            >
                {showForm ? (
                    <>
                        <Undo2 className="h-4 w-4" />
                        Annuler
                    </>
                ) : (
                    <>
                        <Plus className="h-4 w-4" />
                        Ajouter une dépense
                    </>
                )}
            </Button>
        </div>
    );

    // Form Section
    const renderForm = () =>
        showForm && (
            <AnimatePresence>
                <ExpenseForm
                    formData={formData}
                    editingId={editingId}
                    loading={loading}
                    onSubmit={handleSubmit}
                    onInputChange={handleInputChange}
                    onCancel={handleCancelEdit}
                />
            </AnimatePresence>
        );

    // Table Section
    const renderTable = () =>
        expenses.length > 0 ? (
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
                    onDeleteClick={handleDeleteClick}
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
        );

    // Confirmation Modal
    const renderConfirmationModal = () => (
        <ConfirmationModal
            isOpen={isModalOpen}
            onConfirm={handleConfirmDelete}
            onCancel={handleCancelDelete}
            title="Confirmer la suppression"
            message="Êtes-vous sûr de vouloir supprimer cette dépense ?"
        />
    );

    return (
        <div className="md:p-6">
            {renderHeader()}
            {renderAddEditButton()}

            {renderForm()}

            {renderTable()}

            {renderConfirmationModal()}
        </div>
    );
}