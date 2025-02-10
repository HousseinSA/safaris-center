"use client";

import { ClientTableBody } from "./ClientTableBody";
import { Pagination } from "./Pagination";
import { InvoiceModal } from "./InvoiceModal";
import { ConfirmationModal } from "@/components/ConfirmationModal";
import { useClient } from "./hooks/useClients";

export default function ClientTable() {
  const {
    clients,
    groupedClients,
    editingId,
    editedClient,
    loading,
    deletingId,
    isModalOpen,
    selectedClient,
    showInvoice,
    currentPage,
    totalPages,
    indexOfFirstClient,
    indexOfLastClient,
    handleEdit,
    handleSave,
    handleDelete,
    handleEditClientPage,
    handleCheckout,
    handleDeleteClick,
    handleCancelDelete,
    handleNextPage,
    handlePreviousPage,
    setEditedClient,
    setShowInvoice,
    clientsPerPage
  } = useClient();

  return (
    <div className="mt-8">
      <h2 className="text-xl font-bold mb-4 text-primary">Liste des clients</h2>

      {clients.length > 0 ? (
        <div className="w-full overflow-x-auto">
          <ClientTableBody
            groupedClients={groupedClients}
            editingId={editingId}
            editedClient={editedClient}
            loading={loading}
            deletingId={deletingId}
            onEdit={handleEdit}
            onSave={handleSave}
            onDelete={handleDeleteClick}
            onEditClientPage={handleEditClientPage}
            onCheckout={handleCheckout}
            setEditedClient={setEditedClient}
          />

          {!loading && clients.length > clientsPerPage && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              indexOfFirstClient={indexOfFirstClient}
              indexOfLastClient={indexOfLastClient}
              clientsLength={clients.length}
              onNextPage={handleNextPage}
              onPreviousPage={handlePreviousPage}
            />
          )}
        </div>
      ) : (
        !loading && <p className="text-gray-500">Aucun client trouvé.</p>
      )}

      {showInvoice && selectedClient && (
        <InvoiceModal selectedClient={selectedClient} onClose={() => setShowInvoice(false)} />
      )}

      {isModalOpen && deletingId && (
        <ConfirmationModal
          isOpen={isModalOpen}
          onConfirm={() => handleDelete(deletingId)}
          onCancel={handleCancelDelete}
          title="Confirmer la suppression"
          message="Êtes-vous sûr de vouloir supprimer ce client ?"
        />
      )}
    </div>
  );
}