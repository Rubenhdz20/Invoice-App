import React from "react";
import { useInvoiceStore } from "../../context/InvoiceStore";

const InvoiceCard = ({ invoice }) => {
    const { id, createdAt, paymentDue, clientName, total, status } = invoice;

    return (
        <div className="bg-[#1E2139] rounded-lg p-6 flex justify-between items-center">
            <div>
                <p className="text-[#7C5DFA] text-sm">#{id}</p>
                <p className="text-[#0C0E16] text-lg font-bold">{clientName}</p>
                <p className="text-[#888EB0] text-sm">{createdAt}</p>
            </div>
            <div>
                <p className="text-[#0C0E16] text-lg font-bold">${total}</p>
                <p className={`text-sm font-bold ${status === "paid" ? "text-[#33D69F]" : "text-[#FF8B37]"}`}>{status}</p>
            </div>
        </div>
    )
};

export default InvoiceCard;