
import formatDate from "@/lib/formatDate";
import { Service } from "@/lib/types";
interface InvoiceTableProps {
    services: Service[];
}



const InvoiceTable: React.FC<InvoiceTableProps> = ({ services }) => {
    return (
        <div className="mt-4 flex-1 overflow-y-auto">
            <div className="grid grid-cols-4 gap-2 bg-[#ED7D06] text-white p-2 text-xs font-semibold">
                <div>SERVICE</div>
                <div>SERVICE PRIX</div>
                <div>DÉBUT DE SERVICE</div>
                <div>FIN DE SERVICE</div>
            </div>

            <div className="max-h-[300px] overflow-y-auto">
                {services.map((service, index) => (
                    <div key={index} className="grid grid-cols-4 gap-2 py-2 text-xs border-b">
                        <div className="break-words">{service.name}</div>
                        <div>{service.price.toLocaleString()} MRU</div>
                        <div>{formatDate(service.startDate)}</div>
                        <div>{formatDate(service.endDate)}</div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default InvoiceTable