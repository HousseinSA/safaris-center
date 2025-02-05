import { Client } from "@/lib/types";
import Invoice from "./Invoice";

interface InvoiceModalProps {
    selectedClient: Client | null;
    onClose: () => void;
}

export const InvoiceModal = ({ selectedClient, onClose }: InvoiceModalProps) => {
    if (!selectedClient) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="p-8 rounded-lg w-[595px] max-w-full">
                <Invoice userData={selectedClient} onClose={onClose} />
            </div>
        </div>
    );
};