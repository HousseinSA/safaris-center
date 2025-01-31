import Image from "next/image";
import { Printer, Download } from "lucide-react";
import formatDate from "@/lib/formatDate";

interface InvoiceHeaderProps {
    onPrint: () => void;
    onDownload: () => void;
}

export const InvoiceHeader: React.FC<InvoiceHeaderProps> = ({ onPrint, onDownload }) => {
    return (
        <div className="flex justify-between items-start">
            <div>
                <div className="text-xs space-y-0.5">
                    <p className="font-semibold">Date de facture:</p>
                    <p>{formatDate(new Date().toISOString())}</p>
                </div>
                <div className="relative w-20 h-20 overflow-hidden my-2">
                    <Image
                        src="/safariscenter.png"
                        alt="Logo"
                        layout="fill"
                        objectFit="contain"
                    />
                </div>
                <p><span className="text-[.8rem]"> <span className="font-semibold">Tél:</span>  27706495</span></p>
                <p><span className="text-[.8rem]"> <span className="font-semibold">Nif:</span>  01454958</span></p>
            </div>

            <div className="flex flex-col items-end gap-2">
                <h1 className="text-2xl font-bold">FACTURE</h1>
                <div className="flex gap-2">
                    <button
                        onClick={onPrint}
                        className="bg-primary text-white p-2 rounded-lg print-download-buttons"
                    >
                        <Printer className="w-4 h-4" />
                    </button>
                    <button
                        onClick={onDownload}
                        className="bg-primary text-white p-2 rounded-lg print-download-buttons"
                    >
                        <Download className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default InvoiceHeader;