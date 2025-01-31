"use client";
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
}: ServiceInputProps) {
  // Convert the reservation date (MM/dd) to YYYY-MM-DD format for the min attribute
  const [bookingMonth, bookingDay] = dateOfBooking.split("/");
  const minDate = `${new Date().getFullYear()}-${bookingMonth}-${bookingDay}`;

  // Update serviceStartDate when dateOfBooking changes
  useEffect(() => {
    if (dateOfBooking) {
      // Always update serviceStartDate to match dateOfBooking
      onStartDateChange(dateOfBooking);
    }
  }, [dateOfBooking, onStartDateChange]);

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
          value={serviceAmount}
          onChange={(e) => onAmountChange(parseFloat(e.target.value))}
          required
          min={0}
        />
      </div>

      <div>
        <Label className='text-primary' htmlFor="upfrontPayment">Montant avancé</Label>
        <Input
          id="upfrontPayment"
          type="number"
          placeholder="Paiement initial"
          value={upfrontPayment}
          onChange={(e) => onUpfrontPaymentChange(parseFloat(e.target.value))}
          required
          min={0}
        />
      </div>

      <div>
        <Label className='text-primary' htmlFor="serviceStartDate">Date de début du service</Label>
        <Input
          id="serviceStartDate"
          type="date"
          value={
            serviceStartDate
              ? `${new Date().getFullYear()}-${serviceStartDate.replace("/", "-")}` // Convert MM/DD to YYYY-MM-DD
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

      <div>
        <Label className='text-primary' htmlFor="serviceDuration">Durée du service (heures)</Label>
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