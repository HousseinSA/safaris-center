"use client";
import {
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export const ClientTableHeader = () => {
  return (
    <TableHeader className="bg-primary">
      <TableRow className="text-white" >
        <TableHead className="text-white">Nom du client</TableHead>
        <TableHead className="text-white">Services</TableHead>
        <TableHead className="text-white">Montant avancé</TableHead>
        <TableHead className="text-white">Méthode de paiement</TableHead>
        <TableHead className="text-white">Numéro de téléphone</TableHead>
        <TableHead className="text-white">Responsable</TableHead>
        <TableHead className="text-white">Date de réservation</TableHead>
        <TableHead className="text-white">Montant Restant</TableHead>
        <TableHead className="text-white">Total Montant</TableHead>
        <TableHead className="text-white">Actions</TableHead>
      </TableRow>
    </TableHeader>
  );
};