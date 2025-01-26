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
                <Image
                    width={100}
                    height={100}
                    src="/safariscenter.png"
                    alt="Logo"
                    className="w-20 h-20 mt-2 object-contain"
                />
                <p><span className="text-[.8rem]">Tél: 27706495</span></p>
                <p><span className="text-[.8rem]">Nif: 01454958</span></p>
            </div>

            <div className="flex flex-col items-end gap-2">
                <h1 className="text-2xl font-bold">FACTURE</h1>
                <div className="flex gap-2">
                    <button
                        onClick={onPrint}
                        className="bg-primary text-white p-2 rounded-lg"
                    >
                        <Printer className="w-4 h-4" />
                    </button>
                    <button
                        onClick={onDownload}
                        className="bg-primary text-white p-2 rounded-lg"
                    >
                        <Download className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default InvoiceHeader