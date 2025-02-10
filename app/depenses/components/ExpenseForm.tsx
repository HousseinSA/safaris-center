"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Save, Undo2 } from "lucide-react";
import { BeatLoader } from "react-spinners";
import { Expense } from "@/lib/types";
import { paymentMethods } from "@/lib/servicesPaymentData";
import { motion } from "framer-motion";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface ExpenseFormProps {
    formData: Expense;
    editingId: string | null;
    loading: boolean;
    onSubmit: (e: React.FormEvent) => void;
    onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
    onCancel: () => void;
}

export const ExpenseForm = ({ formData, editingId, loading, onSubmit, onInputChange, onCancel }: ExpenseFormProps) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="mb-6"
        >
            <form onSubmit={onSubmit} className="p-4 border rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-1 text-primary">Nom de la dépense</label>
                        <Input
                            name="name"
                            placeholder="Nom de la dépense"
                            value={formData.name}
                            onChange={onInputChange}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1 text-primary">Montant</label>
                        <Input
                            name="price"
                            type="number"
                            placeholder="Montant"
                            value={formData.price}
                            onChange={onInputChange}
                            min="1"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1 text-primary">Responsable</label>
                        <Input
                            name="responsable"
                            placeholder="Responsable"
                            value={formData.responsable}
                            onChange={(e) => {
                                const value = e.target.value;
                                // Allow only letters and spaces
                                if (/^[a-zA-Z\s]*$/.test(value)) {
                                    onInputChange(e); // Call the original input change handler
                                }
                            }}
                            required
                            type="text"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1 text-primary">Date</label>
                        <Input
                            name="date"
                            type="date"
                            placeholder="Date"
                            value={formData.date}
                            onChange={onInputChange}
                            min={new Date().toISOString().split("T")[0]}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1 text-primary">Méthode de paiement</label>
                        <Select
                            value={formData.paymentMethod}
                            onValueChange={(value) => onInputChange({ target: { name: 'paymentMethod', value } } as unknown as React.ChangeEvent<HTMLInputElement>)}
                            required
                        >
                            <SelectTrigger className="w-full rounded-md bg-white text-gray-700 transition-colors duration-300 pr-8">
                                <SelectValue placeholder="Méthode de paiement" />
                            </SelectTrigger>
                            <SelectContent className="rounded-md">
                                <SelectGroup>
                                    <SelectLabel className="text-primary">Modes de paiement</SelectLabel>
                                    {paymentMethods.map((method, index) => (
                                        <SelectItem key={index} value={method} className="text-gray-700 hover:bg-primary hover:text-white">
                                            {method}
                                        </SelectItem>
                                    ))}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <Button type="submit" className="mt-4 text-white" disabled={loading}>
                    {loading ? <BeatLoader color="#ffffff" size={8} /> : <Save className="h-4 w-4 mr-2" />}
                    {editingId ? "Modifier" : "Ajouter"} Dépense
                </Button>
                {editingId && (
                    <Button type="button" onClick={onCancel} className="mt-4 ml-2" variant="outline">
                        <Undo2 className="h-4 w-4 mr-2" />
                        Annuler
                    </Button>
                )}
            </form>
        </motion.div>
    );
};