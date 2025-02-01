interface InvoiceTotalProps {
    totalAmount: number;
}

const InvoiceTotal: React.FC<InvoiceTotalProps> = ({ totalAmount }) => {
    return (
        <div className="mt-4 flex justify-end invoice-table">
            <div className="flex items-center gap-2">
                <span className="font-semibold">TOTAL MONTANT:</span>
                <span className="font-bold">
                    {totalAmount.toLocaleString()} MRU
                </span>
            </div>
        </div>
    );
};

export default InvoiceTotal