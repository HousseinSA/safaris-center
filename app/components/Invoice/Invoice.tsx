"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { Client } from "@/lib/types";
import InvoiceHeader from "./InvoiceHeader";
import ClientInfo from "./ClientInfo";
import InvoiceTable from "./InvoiceTable";
import InvoiceTotal from "./InvoiceTotal";

interface InvoiceProps {
    userData: Client | null;
    onClose: () => void;
}

const Invoice: React.FC<InvoiceProps> = ({ userData, onClose }) => {
    const invoiceRef = useRef<HTMLDivElement>(null);
    const [isClosing, setIsClosing] = useState(false);

    const handleClose = useCallback(() => {
        setIsClosing(true);
        setTimeout(() => {
            onClose();
        }, 200); 
    }, [onClose]);

   
    const handleDownload = async () => {
        if (!invoiceRef.current || !userData) return;

        const buttons = document.querySelectorAll('.print-download-buttons');
        buttons.forEach(button => {
            button.classList.add('hidden-for-pdf');
        });

        const canvas = await html2canvas(invoiceRef.current, {
            scale: 2,
            useCORS: true,
            logging: true,
            backgroundColor: null,
        });

        const pdf = new jsPDF({
            unit: "pt",
            format: "a5",
            hotfixes: ["px_scaling"],
        });

        const imgData = canvas.toDataURL("image/png");
        pdf.addImage(imgData, "PNG", 0, 0, 420, 595);
        pdf.save(`${userData.name.replace(/\s+/g, "_")}_facture.pdf`);

        setTimeout(() => {
            buttons.forEach(button => {
                button.classList.remove('hidden-for-pdf');
            });
        }, 100);
    };

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                handleClose();
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [handleClose]);

    if (!userData) return null;

    const totalAmount = userData.services.reduce((sum, service) => sum + service.price, 0);

    return (
        <AnimatePresence>
            {!isClosing && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.3 }}
                    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
                >
                    <div className="relative w-[500px] max-w-full mx-4">
                        <button
                            onClick={handleClose}
                            className="absolute -top-10 right-0 md:-right-8 md:top-0 bg-primary text-white p-1 rounded-full z-[100] hover:bg-primary/90 transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <div ref={invoiceRef} className="bg-white rounded-lg shadow-2xl relative" style={{ padding: '20px', width: '100%', height: 'auto' }}>
                            <div
                                className="invoice-bg absolute inset-0 bg-contain bg-center opacity-10 z-0"
                                style={{
                                    backgroundImage: "url(/safariscenter.png)",
                                    backgroundSize: "contain",
                                    backgroundPosition: "center",
                                    backgroundRepeat: "no-repeat",
                                    opacity: 0.1,
                                    pointerEvents: "none",
                                }}
                            />

                            <div className="relative z-10 flex flex-col gap-4">
                                <InvoiceHeader  onDownload={handleDownload} />
                                <ClientInfo client={userData} />
                                <InvoiceTable services={userData.services} />
                                <InvoiceTotal totalAmount={totalAmount} />
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default Invoice;