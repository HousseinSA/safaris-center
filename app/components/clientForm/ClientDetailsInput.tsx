import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ConfirmationModal } from "@/components/ConfirmationModal"; // Import the modal

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
    isModalOpen: boolean; // Add this prop
    onConfirmDateChange: () => void; // Add this prop
    onCancelDateChange: () => void; // Add this prop
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
    isModalOpen, // Destructure the prop
    onConfirmDateChange, // Destructure the prop
    onCancelDateChange, // Destructure the prop
}: ClientDetailsInputProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border p-4 rounded-lg">
            {/* First Column */}
            <div className="space-y-4">
                <div>
                    <Label className='text-primary' htmlFor="name">Nom de Client </Label>
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
                        value={
                            dateOfBooking
                                ? `${new Date().getFullYear()}-${dateOfBooking.replace("/", "-")}`
                                : ""
                        }
                        min={new Date().toISOString().split("T")[0]}
                        onChange={(e) => {
                            const value = e.target.value;
                            if (value) {
                                const [, month, day] = value.split("-");
                                const formattedDate = `${month}/${day}`;
                                onDateOfBookingChange(formattedDate);
                            } else {
                                onDateOfBookingChange("");
                            }
                        }}
                        required
                    />
                </div>
                <div>
                    <Label className='text-primary' htmlFor="responsable">Responsable</Label>
                    <Input
                        id="responsable"
                        type="text"
                        value={responsable}
                        onChange={(e) => onResponsableChange(e.target.value)}
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
                        type="text"
                        value={phoneNumber}
                        onChange={(e) => onPhoneNumberChange(e.target.value)}
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