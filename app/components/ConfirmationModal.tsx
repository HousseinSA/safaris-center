"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";

interface ConfirmationModalProps {
    isOpen: boolean;
    onConfirm: () => void;
    onCancel: () => void; // Just hide the modal, no additional logic
    title?: string;
    message?: string;
    isDate?: boolean
}

export function ConfirmationModal({
    isOpen,
    onConfirm,
    onCancel,
    title = "Confirm Deletion",
    message = "Are you sure you want to delete this item?",
    isDate
}: ConfirmationModalProps) {
    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.3 }}
                    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
                >
                    <div className="bg-white p-6 rounded-lg shadow-lg max-w-[400px] ">
                        <h2 className="text-lg font-semibold mb-4">{title}</h2>
                        <p className="mb-6">{message}</p>
                        <div className="flex justify-end gap-4">
                            <Button
                                onClick={onCancel} // Just hide the modal
                                className="bg-gray-500 text-white hover:bg-gray-600"
                                type="button"
                            >
                                Annuler
                            </Button>
                            <Button
                                onClick={onConfirm}
                                className="bg-red-500 text-white hover:bg-red-600"
                                type="button"

                            >

                                {isDate ? 'Confirmer' : 'Supprimer'}
                            </Button>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}