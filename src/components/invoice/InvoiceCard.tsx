import React from "react";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import { formatCurrency } from "../../utils/formatCurrency";

interface Invoice {
    id: string;
    createdAt: string;
    clientName: string;
    total: number;
    status: string;
}

const InvoiceCard: React.FC<{ invoice: Invoice }> = ({ invoice }) => {
    const { id, createdAt,clientName, total, status } = invoice;
    const navigate = useNavigate();

    const formattedDate = dayjs(createdAt).format("DD MMM YYYY");

    const handleCardClick = () => {
        navigate(`/invoice/${id}`);
    }

    return (
        <div className="bg-[#1E2139] rounded-lg p-6 flex justify-between cursor-pointer" onClick={handleCardClick}>
            <div>
                <p className="mb-6 text-[#7E88C3] text-sm">#<span className="text-white">{id}</span></p>
                <p className="mb-2 text-[#DFE3FA] text-sm">Due {formattedDate}</p>
                <p className="text-white text-md font-bold">{formatCurrency(total)}</p>
            </div>
            <div className="flex flex-col items-end justify-between">
                <p className="mb-6 text-white text-md font-bold">{clientName}</p>
                <p
                    className={`inline-flex items-center justify-center w-24 h-10 gap-2 text-sm font-bold px-3 py-1 rounded-md 
                        ${
                        status === "Paid"
                            ? "bg-[#33D69F]/10 text-[#33D69F]"
                            : "bg-[#FF8B37]/10 text-[#FF8B37]"
                        }
                    `}
                >
                    <span className="w-2 h-2 rounded-full bg-current" />
                    {status}    
                </p>
            </div>
        </div>
    )
};

export default InvoiceCard;