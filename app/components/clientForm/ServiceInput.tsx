import { useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Service } from "@/lib/types";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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

  const resetUpfrontPaymentMethod = () => {
    onUpfrontPaymentMethodChange("");
  };

  const resetRemainingPaymentMethod = () => {
    onRemainingPaymentMethodChange("");
  };

  return (
    <div className="grid md:grid-cols-2 gap-4 border p-4 rounded-lg">
      <div>
        <Label className="text-primary" htmlFor="service">
          Service
        </Label>
        <Select
          value={selectedService.name}
          onValueChange={(value) => {
            const selected = servicesList.find((service) => service.name === value);
            if (selected) onServiceChange(selected);
          }}
        >
          <SelectTrigger className="w-full rounded-md bg-white text-gray-700 transition-colors duration-300 pr-8">
            <SelectValue placeholder="Sélectionnez un service" />
          </SelectTrigger>
          <SelectContent className="rounded-md">
            <SelectGroup>
              {servicesList.map((service, index) => (
                <SelectItem key={index} value={service.name} className="text-gray-700 hover:bg-primary hover:text-white">
                  {service.name}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      {/* Service Amount Input */}
      <div>
        <Label className="text-primary" htmlFor="serviceAmount">
          Montant du service
        </Label>
        <Input
          id="serviceAmount"
          type="number"
          placeholder="Montant"
          value={serviceAmount === 0 ? "" : serviceAmount}
          onChange={handleAmountChange}
          required
          min={0}
        />
      </div>

      {/* Upfront Payment Section */}
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <Label className="text-primary" htmlFor="upfrontPayment">
            Montant Avancé
          </Label>
          <Input
            id="upfrontPayment"
            type="number"
            placeholder="Paiement initial"
            value={upfrontPayment === 0 ? "" : upfrontPayment}
            onChange={handleUpfrontPaymentChange}
            required
            min={0}
          />
        </div>
        <div>
          <Label className="text-primary" htmlFor="upfrontPaymentMethod">
            Mode de Paiement Avancé
          </Label>
          <Select
            value={upfrontPaymentMethod}
            onValueChange={(value) => {
              if (value === "reset") {
                resetUpfrontPaymentMethod();
              } else {
                onUpfrontPaymentMethodChange(value);
              }
            }}
            disabled={!upfrontPayment}
          >
            <SelectTrigger className="w-full rounded-md bg-white text-gray-700 transition-colors duration-300 pr-8">
              <SelectValue placeholder="Mode de paiement" />
            </SelectTrigger>
            <SelectContent className="rounded-md">
              <SelectGroup>
                <SelectLabel className="text-primary">Modes de paiement</SelectLabel>
                {paymentMethods.map((method, index) => (
                  <SelectItem key={index} value={method} className="text-gray-700 hover:bg-primary hover:text-white">
                    {method}
                  </SelectItem>
                ))}
                <SelectItem value="reset" className="text-gray-700 hover:bg-primary hover:text-white">
                  Réinitialiser
                </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Service Start Date Input */}
      <div>
        <Label className="text-primary" htmlFor="serviceStartDate">
          Date de Début du Service
        </Label>
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
          className="bg-white text-gray-700"
        />
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <Label className="text-primary" htmlFor="remainingPayment">
            Reste à Payer
          </Label>
          <Input
            id="remainingPayment"
            type="number"
            placeholder="Reste à payer"
            value={Math.max(0, serviceAmount - upfrontPayment)}
            disabled
          />
        </div>
        <div>
          <Label className="text-primary" htmlFor="remainingPaymentMethod">
            Mode de Paiement Restant
          </Label>
          <Select
            value={remainingPaymentMethod}
            onValueChange={(value) => {
              if (value === "reset") {
                resetRemainingPaymentMethod();
              } else {
                handleRemainingPaymentMethodChange(value);
              }
            }}
            disabled={upfrontPayment <= 0 || upfrontPayment >= serviceAmount}
          >
            <SelectTrigger className="w-full rounded-md bg-white text-gray-700 transition-colors duration-300 pr-8">
              <SelectValue placeholder="Mode de paiement" />
            </SelectTrigger>
            <SelectContent className="rounded-md">
              <SelectGroup>
                <SelectLabel className="text-primary">Modes de paiement</SelectLabel>
                {paymentMethods.map((method, index) => (
                  <SelectItem key={index} value={method} className="text-gray-700 hover:bg-primary hover:text-white">
                    {method}
                  </SelectItem>
                ))}
                <SelectItem value="reset" className="text-gray-700 hover:bg-primary hover:text-white">
                  Réinitialiser
                </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Service Duration Input */}
      <div>
        <Label className="text-primary" htmlFor="serviceDuration">
          Durée du Service (Heures)
        </Label>
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