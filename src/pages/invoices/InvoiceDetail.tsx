import React from "react";
import { useParams } from "react-router-dom";
import { useInvoiceStore } from "../../context/InvoiceStore";
import NotFoundInvoice from "../../components/invoice/NotFoundInvoice";
import GoBackButton from "../../components/buttons/GoBackButton";

const InvoiceDetail = () => {
    const { id } = useParams();
    const invoices = useInvoiceStore((state) => state.invoices);
    const invoice = invoices.find((invoice) => invoice.id === id);

    if (!invoice) {
        return (
            <div className="bg-[#141625]">
                <GoBackButton />
                <NotFoundInvoice />
            </div>
        );
    }

    return (
        <div className="bg-[#141625]">
            <GoBackButton />
            <div className="flex justify-center">
                <div className="w-3/4 h-24 flex justify-between items-center bg-[#1E2139] rounded-lg p-6">
                    <div>
                        <p className="text-white font-bold">Status</p>
                        <span>
                            
                        </span>
                    </div>
                </div>
            </div>
        </div>
        
    )
}   

export default InvoiceDetail;