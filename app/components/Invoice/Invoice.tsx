"use client";

import { useRef } from "react";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { Client } from "@/lib/types";
import InvoiceHeader from "./InvoiceHeader";
import ClientInfo from "./ClientInfo";
import ServicesTable from "./ServicesTable";
import InvoiceTotal from "./InvoiceTotal";

interface InvoiceProps {
    userData: Client | null;
    onClose: () => void;
}

const Invoice: React.FC<InvoiceProps> = ({ userData, onClose }) => {
    const invoiceRef = useRef<HTMLDivElement>(null);

    const handleDownload = async () => {
        if (!invoiceRef.current || !userData) return;

        const canvas = await html2canvas(invoiceRef.current, {
            scale: 2,
            useCORS: true,
            logging: true,
            backgroundColor: null,
        });

        const pdf = new jsPDF({
            unit: "px",
            format: [canvas.width, canvas.height],
            hotfixes: ["px_scaling"],
        });

        pdf.addImage(canvas, "PNG", 0, 0, canvas.width, canvas.height);
        pdf.save(`${userData.name.replace(/\s+/g, "_")}_facture.pdf`);
    };

    if (!userData) return null;

    const totalAmount = userData.services.reduce((sum, service) => sum + service.price, 0);

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.3 }}
                className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            >
                <div className="p-6 rounded-lg w-[500px] max-w-full relative">
                    <button
                        onClick={onClose}
                        className="absolute -top-1 right-2 bg-primary text-white p-1 rounded-full z-50 hover:bg-primary/90 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>

                    <div ref={invoiceRef} className="bg-white rounded-lg shadow-2xl relative h-[600px] overflow-hidden">
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

                        <div className="relative z-10 flex flex-col gap-4 p-6 h-full">
                            <InvoiceHeader onPrint={() => window.print()} onDownload={handleDownload} />
                            <ClientInfo client={userData} />
                            <ServicesTable services={userData.services} />
                            <InvoiceTotal totalAmount={totalAmount} />
                        </div>
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
};

export default Invoice