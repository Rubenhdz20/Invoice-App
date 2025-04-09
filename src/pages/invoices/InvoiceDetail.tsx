import React from "react";
import { useParams } from "react-router-dom";
import { useInvoiceStore } from "../../context/InvoiceStore";
import NotFoundInvoice from "../../components/invoice/NotFoundInvoice";
import GoBackButton from "../../components/buttons/GoBackButton";
import { formatCurrency } from "../../utils/formatCurrency";
import dayjs from "dayjs";


const InvoiceDetail = () => {
    const { id } = useParams();
    const invoices = useInvoiceStore((state) => state.invoices);
    const invoice = invoices.find((invoice) => invoice.id === id);
    const formattedDate = dayjs(invoice?.createdAt).format("DD MMM YYYY");
    const formattedPaymentDue = dayjs(invoice?.paymentDue).format("DD MMM YYYY");
    if (!invoice) {
        return (
            <div className="bg-[#141625]">
                <GoBackButton />
                <NotFoundInvoice />
            </div>
        );
    }

    return (
        // Main Container
        <div className="h-screen bg-[#141625]">
            <GoBackButton />
            {/* // Info Status  */}
            <div className="flex justify-center">
                <div className="w-3/4 h-24 flex justify-around items-center bg-[#1E2139] rounded-lg">
                    <p className="text-white font-bold">Status</p>
                    <div className="flex items-center justify-center gap-2"> 
                        <span 
                          className={`inline-flex items-center justify-center w-24 h-10 gap-2 text-sm font-bold px-3 py-1 rounded-md transition ${
                            invoice.status === "Paid"
                                    ? "bg-[#33D69F]/10 text-[#33D69F]"
                                    : invoice.status === "Pending"
                                    ? "bg-[#FF8B37]/10 text-[#FF8B37]"
                                    : "bg-[#DFE3FA]/10 text-[#DFE3FA]"
                            }`}>
                            <span className="w-2 h-2 rounded-full bg-current"></span>
                            {invoice.status}
                        </span>
                    </div>
                </div>
            </div>
            {/* Invoice Main Info */}
            <div className="flex justify-center">
                <div className="w-3/4 mt-6 p-6 bg-[#1E2139] rounded-lg">
                    {/* Invoice ID */}
                    <p className="text-white font-bold">
                        <span className="text-[#7E88C3]">
                            #
                        </span>
                        {invoice.id}
                    </p>
                    <p className="text-[#DFE3FA] font-bold">{invoice.description}</p>
                    {/* Sender Address */}
                    <div className="flex justify-between mt-4">
                        <div>
                            <p className="text-sm text-[#DFE3FA]">{invoice.senderAddress.street}</p>
                            <p className="text-sm text-[#DFE3FA]">{invoice.senderAddress.city}</p>
                            <p className="text-sm text-[#DFE3FA]">{invoice.senderAddress.postCode}</p>
                            <p className="text-sm text-[#DFE3FA]">{invoice.senderAddress.country}</p>
                        </div>
                    </div>
                    {/* Invoice Date, Payment Due, Send to */}
                    <div className="flex justify-between mt-4">
                        <div className="flex flex-col gap-2">
                            <p className="text-sm text-white">Invoice Date</p>
                            <p className="text-sm text-white font-bold mb-4">{formattedDate}</p>
                            <p className="text-sm text-white">Payment Due</p>
                            <p className="text-sm text-white font-bold mb-4">{formattedPaymentDue}</p>
                            <p className="text-sm text-white">Send to</p>
                            <p className="text-sm text-white font-bold">{invoice.clientEmail}</p>
                        </div>
                        <div className="flex flex-col">
                            <p className="text-sm text-[#DFE3FA] mb-2 ">Bill To</p>
                            <p className="text-sm text-[#DFE3FA]  font-bold mb-2">{invoice.clientName}</p>
                            <p className="text-sm text-[#DFE3FA]">{invoice.clientAddress.street}</p>
                            <p className="text-sm text-[#DFE3FA]">{invoice.clientAddress.city}</p>
                            <p className="text-sm text-[#DFE3FA]">{invoice.clientAddress.postCode}</p>
                            <p className="text-sm text-[#DFE3FA]">{invoice.clientAddress.country}</p>
                        </div>  
                    </div>
                    {/* Invoice Items and Prices */}
                    <div className="w-full mt-6 bg-[#252945] p-4 rounded">
                        {invoice.items.map((item, index) => (
                            <div key={index} className="flex justify-between items-center mb-2">
                                <div className="flex flex-col">
                                    <p className="text-white font-bold">{item.name}</p>
                                    <p className="text-gray-300">
                                            {formatCurrency(item.quantity)} x {formatCurrency(item.price)}
                                    </p>
                                </div>
                                <p className="text-white font-bold">{formatCurrency(item.total)}</p>
                            </div>
                        ))}
                        {/* Invoice total */}
                        <div className="w-full h-full flex items-center justify-between mt-4 bg-[#0C0E16] p-5 rounded">
                            <p className="text-sm font-bold text-white">Amount Due</p>
                            <p className="text-white text-2xl font-bold">{formatCurrency(invoice.total)}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}   

export default InvoiceDetail;