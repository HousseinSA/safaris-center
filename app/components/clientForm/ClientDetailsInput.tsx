import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ConfirmationModal } from "@/components/ConfirmationModal";

interface ClientDetailsInputProps {
    name: string;
    phoneNumber: string;
    responsable: string;
    paymentMethod: string;
    dateOfBooking: string;
    onNameChange: (value: string) => void;
    onPhoneNumberChange: (value: string) => void;
    onResponsableChange: (value: string) => void;
    onPaymentMethodChange: (value: string) => void;
    onDateOfBookingChange: (value: string) => void;
    paymentMethods: string[];
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
    paymentMethod,
    dateOfBooking,
    onNameChange,
    onPhoneNumberChange,
    onResponsableChange,
    onPaymentMethodChange,
    onDateOfBookingChange,
    paymentMethods,
    hasServices,
    isModalOpen,
    onConfirmDateChange,
    onCancelDateChange,
    isEditing
}: ClientDetailsInputProps) {

    const currentDate = new Date().toISOString().split('T')[0];

    // Format existing booking date for input
    const existingBookingDate = dateOfBooking
        ? `${new Date().getFullYear()}-${dateOfBooking.split('/')[0].padStart(2, '0')}-${dateOfBooking.split('/')[1].padStart(2, '0')}`
        : '';

    const minDate = isEditing
        ? existingBookingDate
        : currentDate;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border p-4 rounded-lg">
            {/* First Column */}
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
                        onChange={(e) => {
                            const date = new Date(e.target.value);
                            const formattedDate = `${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getDate().toString().padStart(2, '0')}`;
                            onDateOfBookingChange(formattedDate);
                        }}
                        min={minDate} // Use the calculated min date
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

            {/* Second Column */}
            <div className="space-y-4">
                <div>
                    <Label className='text-primary' htmlFor="paymentMethod">Méthode de paiement</Label>
                    <select
                        id="paymentMethod"
                        value={paymentMethod}
                        onChange={(e) => onPaymentMethodChange(e.target.value)}
                        className="w-full p-2 border rounded"
                        required
                    >
                        {paymentMethods.map((method, index) => (
                            <option key={index} value={method}>
                                {method}
                            </option>
                        ))}
                    </select>
                </div>
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