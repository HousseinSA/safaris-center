'use client'
import { Button } from "@/components/ui/button";
import { BeatLoader } from "react-spinners";
import { motion, AnimatePresence } from "framer-motion";
import { ClientDetailsInput } from "./ClientDetailsInput";
import { ServiceInput } from "./ServiceInput";
import { ServiceTable } from "./ServiceTable";
import { useClientForm } from "./hooks/useClientForm";
import { paymentMethods, servicesList } from "@/lib/servicesPaymentData";
import { Client } from "@/lib/types";
import { Plus, Save, Undo2 } from "lucide-react";
interface AddClientFormProps {
  client?: Client;
  onSave?: (client: Client) => void;
}

export default function AddClientForm({ client, onSave }: AddClientFormProps) {
  const {
    name,
    setName,
    paymentMethod,
    setPaymentMethod,
    phoneNumber,
    setPhoneNumber,
    responsable,
    setResponsable,
    dateOfBooking,
    setDateOfBooking,
    loading,
    services,
    selectedService,
    serviceAmount,
    upfrontPayment,
    serviceDuration,
    serviceStartDate,
    editingServiceIndex,
    showServiceInput,
    setSelectedService,
    setServiceAmount,
    setUpfrontPayment,
    setServiceDuration,
    setServiceStartDate,
    setShowServiceInput,
    handleAddOrModifyService,
    handleRemoveService,
    handleEditService,
    handleSubmit,
    isModalOpen,
    handleConfirmDateChange,
    handleCancelDateChange,
  } = useClientForm({ client, onSave });


  const isEditing = !!client;
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <ClientDetailsInput
        name={name}
        phoneNumber={phoneNumber}
        responsable={responsable}
        paymentMethod={paymentMethod}
        dateOfBooking={dateOfBooking}
        onNameChange={setName}
        onPhoneNumberChange={setPhoneNumber}
        onResponsableChange={setResponsable}
        onPaymentMethodChange={setPaymentMethod}
        onDateOfBookingChange={setDateOfBooking}
        paymentMethods={paymentMethods}
        hasServices={services.length > 0}
        isModalOpen={isModalOpen}
        onConfirmDateChange={handleConfirmDateChange}
        onCancelDateChange={handleCancelDateChange}
        isEditing={isEditing}
      />
      {!showServiceInput && (
        <Button
          type="button"
          onClick={() => setShowServiceInput(true)}
          className="text-white"
        >
          <Plus className="h-4 w-4" />

          Ajouter un service
        </Button>
      )}

      <AnimatePresence>
        {showServiceInput && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <ServiceInput
              selectedService={selectedService}
              serviceAmount={serviceAmount}
              upfrontPayment={upfrontPayment}
              serviceDuration={serviceDuration}
              serviceStartDate={serviceStartDate}
              onServiceChange={setSelectedService}
              onAmountChange={setServiceAmount}
              onUpfrontPaymentChange={setUpfrontPayment}
              onDurationChange={setServiceDuration}
              onStartDateChange={setServiceStartDate}
              servicesList={servicesList}
              dateOfBooking={dateOfBooking}
            />
            <Button
              type="button"
              onClick={() => handleAddOrModifyService(dateOfBooking)}
              className="text-white mt-4"
            >
              <Plus className="h-4 w-4" />
              {editingServiceIndex !== null ? "Modifier le service" : "Ajouter le service"}
            </Button>
            <Button
              type="button"
              onClick={() => setShowServiceInput(false)}
              className="text-white mt-4 ml-2"
            >
              <Undo2 className="h-4 w-4" />
              Annuler
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
      {services.length > 0 && (
        <ServiceTable
          services={services}
          onEditService={handleEditService}
          onRemoveService={handleRemoveService}
        />
      )}
      <br />
      <Button type="submit" className="text-white" disabled={loading}>
        {loading ? <BeatLoader color="#ffffff" size={8} /> : <Save className="h-4 w-4 mr-2" />}
        {client ? "Modifier client" : "Enregistrer client"}
      </Button>
    </form>
  );
}