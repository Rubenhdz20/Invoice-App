import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useInvoiceStore } from "../../store/InvoiceStore";
import NotFoundInvoice from "../../components/invoice/NotFoundInvoice";
import GoBackButtonHome from "../../components/buttons/GoBackButtonHome";
import ConfirmDeleteModal from "../../components/modals/ConfirmDeleteModal";
import { formatCurrency } from "../../utils/formatCurrency";
import dayjs from "dayjs";

// [Layout] [Box Model] [Position] [Flex/Grid] [Size] [Typography] [Color] [Effects] [Other]

const InvoiceDetail = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const invoices = useInvoiceStore((state) => state.invoices);
    const invoice = invoices.find((invoice) => invoice.id === id);
    const deleteInvoice = useInvoiceStore((state) => state.deleteInvoice);
    const togglePaid = useInvoiceStore((s) => s.togglePaid);
    const isPaid = invoice?.status === "Paid";
    const [isModalOpen, setModalOpen] = useState(false);
    const formattedDate = dayjs(invoice?.createdAt).format("DD MMM YYYY");
    const formattedPaymentDue = dayjs(invoice?.paymentDue).format("DD MMM YYYY");
    
    const handleDeleteClick = () => setModalOpen(true);
    const handleCancel = () => setModalOpen(false);
    const handleEditClick = () => { navigate(`/edit-invoice/${id}`) };

    const handleConfirm = () => {
        deleteInvoice(id!);
        setModalOpen(false);
        navigate("/", { replace: true });
    };

    if (!invoice) {
        return (
            <div className="bg-dark-2">
                <GoBackButtonHome />
                <NotFoundInvoice />
            </div>
        );
    }

    return (
        <div className="bg-white-custom dark:bg-dark-2">
            <GoBackButtonHome />
            {/* // Info Status  */}
            <div className="flex justify-center">
                <div className="w-3/4 h-24 flex justify-around items-center bg-white dark:bg-strong-blue rounded-lg">
                    <p className="text-medium-gray dark:text-white font-bold">Status</p>
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
                <div className="w-3/4 mt-6 p-6 bg-white dark:bg-strong-blue rounded-lg">
                    {/* Invoice ID */}
                    <p className="text-dark-1 dark:text-white font-bold">
                        <span className="text-purple dark:text-purple">
                            #
                        </span>
                        {invoice.id}
                    </p>
                    <p className="text-purple dark:text-light-gray font-medium">{invoice.description}</p>
                    {/* Sender Address */}
                    <div className="flex justify-between mt-4">
                        <div>
                            <p className="text-sm text-purple dark:text-light-gray font-medium">{invoice.senderAddress.street}</p>
                            <p className="text-sm text-purple dark:text-light-gray font-medium">{invoice.senderAddress.city}</p>
                            <p className="text-sm text-purple dark:text-light-gray font-medium">{invoice.senderAddress.postCode}</p>
                            <p className="text-sm text-purple dark:text-light-gray font-medium">{invoice.senderAddress.country}</p>
                        </div>
                    </div>
                    {/* Invoice Date, Payment Due, Send to, Bill to*/}
                    <div className="flex justify-between mt-4">
                        <div className="flex flex-col gap-2">
                            <p className="text-sm text-purple dark:text-light-gray font-medium">Invoice Date</p>
                            <p className="text-sm text-dark-1 dark:text-white font-bold mb-4">{formattedDate}</p>
                            <p className="text-sm text-purple dark:text-light-gray font-medium">Payment Due</p>
                            <p className="text-sm text-dark-1 dark:text-white font-bold mb-4">{formattedPaymentDue}</p>
                            <p className="text-sm text-purple dark:text-light-gray font-medium">Send to</p>
                            <p className="text-sm text-dark-1 dark:text-white font-bold">{invoice.clientEmail}</p>
                        </div>
                        <div className="flex flex-col">
                            <p className="text-sm text-purple dark:text-light-gray font-medium mb-2 ">Bill To</p>
                            <p className="text-sm text-dark-1 dark:text-white font-bold mb-2">{invoice.clientName}</p>
                            <p className="text-sm text-purple dark:text-light-gray font-medium">{invoice.clientAddress.street}</p>
                            <p className="text-sm text-purple dark:text-light-gray font-medium">{invoice.clientAddress.city}</p>
                            <p className="text-sm text-purple dark:text-light-gray font-medium">{invoice.clientAddress.postCode}</p>
                            <p className="text-sm text-purple dark:text-light-gray font-medium">{invoice.clientAddress.country}</p>
                        </div>  
                    </div>
                    {/* Invoice Items and Prices */}
                    <div className="w-full mt-6 bg-card-gray dark:bg-light-blue rounded">
                        {invoice.items.map((item, index) => (
                            <div key={index} className="flex justify-between items-center p-4">
                                <div className="flex flex-col">
                                    <p className="text-dark-1 dark:text-white font-boldv">{item.name}</p>
                                    <p className="text-purple dark:text-strong-gray font-bold">
                                        {formatCurrency(item.quantity)} x {formatCurrency(item.price)}
                                    </p>
                                </div>
                                <p className="dark:text-white font-bold">{formatCurrency(item.total)}</p>
                            </div>
                        ))}
                        {/* Invoice total */}
                        <div className="w-full flex items-center justify-between bg-total-gray dark:bg-dark-1 p-5 rounded">
                            <p className="text-sm font-bold text-white">Amount Due</p>
                            <p className="text-white font-bold text-2xl ">{formatCurrency(invoice.total)}</p>
                        </div>
                    </div>
                </div>
            </div>
            {/* // Edit, Delete, Mark as paid buttons */}
            <div className="h-25 flex justify-center items-center mt-14 px-6 py-4 space-x-4 bg-white  dark:bg-strong-blue rounded-lg">
                <button className="w-16 h-12 text-purple dark:text-white bg-card-gray dark:bg-light-blue rounded-3xl cursor-pointer hover:bg-white hover:text-[#7E88C3] transition" onClick={handleEditClick}>Edit</button>
                <button className="w-20 h-12 text-white bg-[#EC5757] rounded-3xl cursor-pointer hover:bg-[#FF9797] transition" onClick={handleDeleteClick}>Delete</button>
                <button className="w-36 h-12 text-white bg-[#7C5DFA] rounded-3xl cursor-pointer hover:bg-[#9277FF] transition" onClick={() => togglePaid(id!)}>
                    {isPaid ? "Mark as Pending" : "Mark as Paid"}
                </button>
            </div>
            <ConfirmDeleteModal
                invoiceId={id!}
                isOpen={isModalOpen}
                onCancel={handleCancel}
                onConfirm={handleConfirm}
            />
        </div>
    )
}   

export default InvoiceDetail;