import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ConfirmationModal } from "@/components/ConfirmationModal";
import { useState } from "react";

interface ClientDetailsInputProps {
    name: string;
    phoneNumber: string;
    responsable: string;
    dateOfBooking: string;
    onNameChange: (value: string) => void;
    onPhoneNumberChange: (value: string) => void;
    onResponsableChange: (value: string) => void;
    onDateOfBookingChange: (value: string) => void;
    hasServices: boolean;
    isModalOpen: boolean;
    onConfirmDateChange: () => void;
    onCancelDateChange: () => void;
    isEditing: boolean;
}

export function ClientDetailsInput({
    name,
    phoneNumber,
    responsable,
    dateOfBooking,
    onNameChange,
    onPhoneNumberChange,
    onResponsableChange,
    onDateOfBookingChange,
    hasServices,
    isModalOpen,
    onConfirmDateChange,
    onCancelDateChange,
    isEditing
}: ClientDetailsInputProps) {
    const currentDate = new Date().toISOString().split('T')[0];

    const [isReservationClick, setIsReservationClick] = useState(false);

    const existingBookingDate = dateOfBooking
        ? `${new Date().getFullYear()}-${dateOfBooking.split('/')[0].padStart(2, '0')}-${dateOfBooking.split('/')[1].padStart(2, '0')}`
        : '';
    const minDate = isReservationClick ? currentDate : existingBookingDate || currentDate;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border p-4 rounded-lg">
            <div className="space-y-4">
                <div>
                    <Label className='text-primary' htmlFor="name">Nom de Client</Label>
                    <Input
                        id="name"
                        type="text"
                        value={name}
                        onChange={(e) => onNameChange(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <Label className='text-primary' htmlFor="dateOfBooking">Date de réservation</Label>
                    {hasServices && (
                        <p className="text-red-500 text-sm mb-2">
                            Le changement de date supprimera tous les services.
                        </p>
                    )}
                    <Input
                        id="dateOfBooking"
                        type="date"
                        value={dateOfBooking ? existingBookingDate : ''}
                        onClick={() => setIsReservationClick(true)}
                        onChange={(e) => {
                            const selectedDate = e.target.value;
                            const formattedDate = `${new Date(selectedDate).getMonth() + 1}/${new Date(selectedDate).getDate()}`;
                            onDateOfBookingChange(formattedDate);
                        }}
                        onBlur={(e) => {
                            if (e.target.value === existingBookingDate) {
                                setIsReservationClick(false);
                            }
                        }}
                        min={minDate}
                        required
                    />
                </div>
            </div>
            <div className={`${isEditing ? "space-y-11" : "space-y-4"}`}>
                <div>
                    <Label className='text-primary' htmlFor="phoneNumber">Numéro de téléphone</Label>
                    <Input
                        id="phoneNumber"
                        type="tel"
                        value={phoneNumber}
                        onChange={(e) => {
                            const value = e.target.value;
                            if (/^\d{0,8}$/.test(value)) {
                                onPhoneNumberChange(value);
                            }
                        }}
                        maxLength={8}
                        required
                    />
                </div>
                <div>
                    <Label className='text-primary' htmlFor="responsable">Responsable</Label>
                    <Input
                        id="responsable"
                        type="text"
                        value={responsable}
                        onChange={(e) => {
                            const value = e.target.value;
                            if (/^[a-zA-Z\s]*$/.test(value)) {
                                onResponsableChange(value);
                            }
                        }}
                        required
                    />
                </div>
            </div>
            {/* Confirmation Modal */}
            <ConfirmationModal
                isOpen={isModalOpen}
                onConfirm={onConfirmDateChange}
                onCancel={onCancelDateChange}
                title="Confirmer le changement de date."
                message="Si vous changez la date, tous les services seront supprimés. Voulez-vous continuer ? "
                isDate={true}
            />
        </div>
    );
}