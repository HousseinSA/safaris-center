import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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
    hasServices: boolean; // Add this prop
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
    hasServices, // Destructure the new prop
}: ClientDetailsInputProps) {
    return (
        // Add a border to the container for better visual separation
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border p-4 rounded-lg">
            {/* First Column */}
            <div className="space-y-4">
                <div>
                    <Label className='text-primary' htmlFor="name">Nom du client</Label>
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
                    {/* Display warning message if services exist */}
                    {hasServices && (
                        <p className="text-red-500 text-sm mb-2">
                            Si vous modifiez la date de réservation, tous les services seront supprimés.
                        </p>
                    )}
                    <Input
                        id="dateOfBooking"
                        type="date"
                        value={
                            dateOfBooking
                                ? `${new Date().getFullYear()}-${dateOfBooking.replace("/", "-")}` // Convert MM/DD to YYYY-MM-DD
                                : ""
                        }
                        min={new Date().toISOString().split("T")[0]} // Set the minimum date to today
                        onChange={(e) => {
                            const value = e.target.value;
                            if (value) {
                                // Extract the month and day from the date string (YYYY-MM-DD)
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

                {/* Move "Responsable" to the left column */}
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
        </div>
    );
}