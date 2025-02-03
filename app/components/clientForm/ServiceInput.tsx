import { useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Service } from "@/lib/types";

interface ServiceInputProps {
  selectedService: Service;
  serviceAmount: number;
  upfrontPayment: number;
  serviceDuration: number;
  serviceStartDate: string;
  onServiceChange: (service: Service) => void;
  onAmountChange: (value: number) => void;
  onUpfrontPaymentChange: (value: number) => void;
  onDurationChange: (value: number) => void;
  onStartDateChange: (value: string) => void;
  servicesList: Service[];
  dateOfBooking: string;
  paymentMethods: string[];
  upfrontPaymentMethod: string;
  remainingPaymentMethod: string;
  onUpfrontPaymentMethodChange: (method: string) => void;
  onRemainingPaymentMethodChange: (method: string) => void;
  completePayment: (name: string) => void;
}

export function ServiceInput({
  selectedService,
  serviceAmount,
  upfrontPayment,
  serviceDuration,
  serviceStartDate,
  onServiceChange,
  onAmountChange,
  onUpfrontPaymentChange,
  onDurationChange,
  onStartDateChange,
  servicesList,
  dateOfBooking,
  paymentMethods,
  upfrontPaymentMethod,
  remainingPaymentMethod,
  onUpfrontPaymentMethodChange,
  onRemainingPaymentMethodChange,
  completePayment,
}: ServiceInputProps) {
  const [bookingMonth, bookingDay] = dateOfBooking.split("/");
  const minDate = `${new Date().getFullYear()}-${bookingMonth}-${bookingDay}`;

  useEffect(() => {
    if (dateOfBooking) {
      onStartDateChange(dateOfBooking);
    }
  }, [dateOfBooking, onStartDateChange]);

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === "" || /^[0-9]*\.?[0-9]*$/.test(value)) {
      onAmountChange(value ? parseFloat(value) : 0);
    }
  };

  const handleUpfrontPaymentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === "" || /^[0-9]*\.?[0-9]*$/.test(value)) {
      onUpfrontPaymentChange(value ? parseFloat(value) : 0);
    }
  };

  const handleRemainingPaymentMethodChange = (method: string) => {
    onRemainingPaymentMethodChange(method);
    if (method) {
      completePayment(selectedService.name);
    }
  };

  return (
    <div className="grid md:grid-cols-2 gap-4 border p-4 rounded-lg">
      <div>
        <Label className='text-primary' htmlFor="service">Service</Label>
        <select
          id="service"
          value={selectedService.name}
          onChange={(e) => {
            const selected = servicesList.find(
              (service) => service.name === e.target.value
            );
            if (selected) onServiceChange(selected);
          }}
          className="w-full p-2 border rounded"
        >
          {servicesList.map((service, index) => (
            <option key={index} value={service.name}>
              {service.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <Label className='text-primary' htmlFor="serviceAmount">Montant du service</Label>
        <Input
          id="serviceAmount"
          type="number"
          placeholder="Montant"
          value={serviceAmount === 0 ? "" : serviceAmount} // Show '0' as default
          onChange={handleAmountChange}
          required
          min={0}
        />
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <Label className='text-primary' htmlFor="upfrontPayment">Montant Avancé</Label>
          <Input
            id="upfrontPayment"
            type="number"
            placeholder="Paiement initial"
            value={upfrontPayment === 0 ? "" : upfrontPayment} // Show '0' as default
            onChange={handleUpfrontPaymentChange}
            required
            min={0}
          />
        </div>
        <div>
          <Label className='text-primary' htmlFor="upfrontPaymentMethod">Mode de Paiement Avancé</Label>
          <select
            id="upfrontPaymentMethod"
            value={upfrontPaymentMethod}
            onChange={(e) => onUpfrontPaymentMethodChange(e.target.value)}
            className="w-full p-2 border rounded"
            required={upfrontPayment > 0} // Only required if upfront payment is greater than 0
            disabled={!upfrontPayment}
          >
            <option value="">Sélectionnez un mode de paiement</option>
            {paymentMethods.map((method, index) => (
              <option key={index} value={method}>
                {method}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <Label className='text-primary' htmlFor="serviceStartDate">Date de Début du Service</Label>
        <Input
          id="serviceStartDate"
          type="date"
          value={
            serviceStartDate
              ? `${new Date().getFullYear()}-${serviceStartDate.replace("/", "-")}`
              : ""
          }
          onChange={(e) => {
            const value = e.target.value;
            if (value) {
              const [, month, day] = value.split("-");
              const formattedDate = `${month}/${day}`;
              onStartDateChange(formattedDate);
            } else {
              onStartDateChange("");
            }
          }}
          min={minDate}
          required
        />
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <Label className='text-primary' htmlFor="remainingPayment">Reste à Payer</Label>
          <Input
            id="remainingPayment"
            type="number"
            placeholder="Reste à payer"
            value={Math.max(0, serviceAmount - upfrontPayment)}
            disabled
          />
        </div>
        <div>
          <Label className='text-primary' htmlFor="remainingPaymentMethod">Mode de Paiement Restant</Label>
          <select
            id="remainingPaymentMethod"
            value={remainingPaymentMethod}
            onChange={(e) => handleRemainingPaymentMethodChange(e.target.value)}
            className="w-full p-2 border rounded"
            disabled={upfrontPayment <= 0} // Disable if upfront payment does not exist
          >
            <option value="">Sélectionnez un mode de paiement</option>
            {paymentMethods.map((method, index) => (
              <option key={index} value={method}>
                {method}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <Label className='text-primary' htmlFor="serviceDuration">Durée du Service (Heures)</Label>
        <Input
          id="serviceDuration"
          type="number"
          placeholder="Durée"
          value={serviceDuration}
          onChange={(e) => onDurationChange(parseInt(e.target.value))}
          required
          min={1}
        />
      </div>
    </div>
  );
}