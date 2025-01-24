"use client";

import { useRef } from "react";
import Image from "next/image";
import { Printer, Download, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { Client } from "@/lib/types";



interface InvoiceProps {
    userData: Client | null;
    onClose: () => void;
}

const Invoice: React.FC<InvoiceProps> = ({ userData, onClose }) => {
    const invoiceRef = useRef<HTMLDivElement>(null);
    console.log('userdata', userData)

    const handleDownload = async () => {
        if (!invoiceRef.current || !userData) return;

        const original = invoiceRef.current;
        const contentWidth = original.scrollWidth;
        const contentHeight = original.scrollHeight;

        const clone = original.cloneNode(true) as HTMLElement;
        clone.style.position = 'fixed';
        clone.style.left = '-9999px';
        clone.style.top = '0';
        clone.style.width = `${contentWidth}px`;
        clone.style.height = `auto`;
        clone.style.backgroundColor = 'white';

        // Fix service list height in clone
        const serviceList = clone.querySelector('.max-h-\\[200px\\]');
        if (serviceList) {
            serviceList.classList.remove('max-h-[200px]');
            serviceList.classList.add('h-auto');
        }

        // Fix background image in clone
        const bg = clone.querySelector('.invoice-bg') as HTMLElement;
        if (bg) {
            bg.style.backgroundImage = `url(${window.location.origin}/safariscenter.png)`;
            bg.style.backgroundSize = 'contain';
            bg.style.backgroundPosition = 'center';
            bg.style.opacity = '0.1';
            bg.style.pointerEvents = 'none';
        }

        document.body.appendChild(clone);

        const canvas = await html2canvas(clone, {
            scale: 2,
            useCORS: true,
            logging: true,
            backgroundColor: null,
            windowWidth: contentWidth,
            windowHeight: contentHeight
        });

        document.body.removeChild(clone);

        const pdf = new jsPDF({
            unit: 'px',
            format: [contentWidth, contentHeight],
            hotfixes: ['px_scaling']
        });

        pdf.addImage(canvas, 'PNG', 0, 0, contentWidth, contentHeight);
        pdf.save(`${userData.name.replace(/\s+/g, '_')}_facture.pdf`);
    };
    const formatDate = (dateString: string) => {
        return format(new Date(dateString), "dd MMM yyyy, hh:mm a");
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
                    {/* Close Button with primary background */}
                    <button
                        onClick={onClose}
                        className="absolute -top-1 right-2 bg-primary text-white p-1 rounded-full z-50 hover:bg-primary/90 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>

                    <div ref={invoiceRef} className="bg-white rounded-lg shadow-2xl relative">
                        <div
                            className="invoice-bg absolute inset-0 bg-contain bg-center opacity-10 z-0"
                            style={{
                                backgroundImage: 'url(/safariscenter.png)',
                                backgroundSize: 'contain',
                                backgroundPosition: 'center',
                                backgroundRepeat: 'no-repeat',
                                opacity: 0.1,
                                pointerEvents: 'none'
                            }}
                        />

                        <div className="relative z-10 flex flex-col gap-4 p-6">
                            {/* Header */}
                            <div className="flex justify-between items-start">
                                <div>
                                    <div className="text-xs space-y-0.5">
                                        <p className="font-semibold">Date de création:</p>
                                        <p>{format(new Date(), "dd/MM/yyyy HH:mm")}</p>
                                    </div>
                                    <Image
                                        width={100}
                                        height={100}
                                        src="/safariscenter.png"
                                        alt="Logo"
                                        className="w-20 h-20 mt-2 object-contain"
                                    />
                                </div>

                                <div className="flex flex-col items-end gap-2">
                                    <h1 className="text-2xl font-bold">FACTURE</h1>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => window.print()}
                                            className="bg-primary text-white p-2 rounded-lg"
                                        >
                                            <Printer className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={handleDownload}
                                            className="bg-primary text-white p-2 rounded-lg"
                                        >
                                            <Download className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Client Info */}
                            <div className="mt-4 space-y-1">
                                <h2 className="font-semibold">Facturer à :</h2>
                                <div className="text-xs">
                                    <p><span className="font-medium">Nom de client:</span> {userData.name}</p>
                                    <p><span className="font-medium">Date de réservation:</span> {formatDate(userData.dateOfBooking)}</p>

                                    <p><span className="font-medium">Tél:</span> {userData.phoneNumber}</p>
                                    <p><span className="font-medium">Méthode de Paiement:</span> {userData.paymentMethod}</p>
                                </div>
                            </div>

                            {/* Services Table */}
                            <div className="mt-4">
                                <div className="grid grid-cols-4 gap-2 bg-[#ED7D06] text-white p-2 text-xs font-semibold">
                                    <div>SERVICE</div>
                                    <div>SERVICE PRIX</div>
                                    <div>DÉBUT DE SERVICE</div>
                                    <div>FIN DE SERVICE</div>
                                </div>

                                <div className="max-h-[200px] overflow-y-auto">
                                    {userData.services.map((service, index) => (
                                        <div key={index} className="grid grid-cols-4 gap-2 py-2 text-xs border-b">
                                            <div className="break-words">{service.name}</div>
                                            <div>{service.price.toLocaleString()} MRU</div>
                                            <div>{formatDate(service.startDate)}</div>
                                            <div>{formatDate(service.endDate)}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Total */}
                            <div className="mt-4 flex justify-end">
                                <div className="flex items-center gap-2">
                                    <span className="font-semibold"> TOTAL MONTANT:</span>
                                    <span className="font-bold">
                                        {totalAmount.toLocaleString()} MRU
                                    </span>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
};

export default Invoice;