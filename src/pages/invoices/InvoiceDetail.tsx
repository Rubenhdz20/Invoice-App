import React, { useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useInvoiceStore } from "../../store/InvoiceStore";
import NotFoundInvoice from "../../components/invoice/NotFoundInvoice";
import GoBackButtonHome from "../../components/buttons/GoBackButtonHome";
import ConfirmDeleteModal from "../../components/modals/ConfirmDeleteModal";
import { formatCurrency } from "../../utils/formatCurrency";
import dayjs from "dayjs";

interface InvoiceDetailProps {
  invoice: {
    id: string;
    createdAt: string;
    paymentDue: string;
    clientEmail: string;
    clientName: string;
    clientAddress: {
      street: string;
      city: string;
      postCode: string;
      country: string;
    };
    senderAddress: {
      street: string;
      city: string;
      postCode: string;
      country: string;
    };
    items: { name: string; quantity: number; price: number; total: number }[];
    total: number;
    status: string;
    description: string;
  };
}

const InvoiceDetail: React.FC<InvoiceDetailProps> = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const invoices = useInvoiceStore((state) => state.invoices);
    const invoice = invoices.find((invoice) => invoice.id === id);
    const deleteInvoice = useInvoiceStore((state) => state.deleteInvoice);
    const togglePaid = useInvoiceStore((s) => s.togglePaid);
    const [isModalOpen, setModalOpen] = useState(false);
    const formattedDate = useMemo(() => dayjs(invoice?.createdAt).format("DD MMM YYYY"), [invoice?.createdAt]);
    const formattedPaymentDue = useMemo(() => dayjs(invoice?.paymentDue).format("DD MMM YYYY"), [invoice?.paymentDue]);
    const isPaid = useMemo(() => invoice?.status === "Paid", [invoice?.status]);

    const handleDeleteClick = () => setModalOpen(true);
    const handleCancel = () => setModalOpen(false);
    const handleEditClick = () => { navigate(`/edit-invoice/${id}`) };

    const handleConfirm = () => {
        deleteInvoice(id!);
        setModalOpen(false);
        navigate("/", { replace: true });
    };

    const getStatusBadgeClasses = (status: string) => {
        switch (status) {
          case "Paid":
            return "bg-[#33D69F]/10 text-[#33D69F]";
          case "Pending":
            return "bg-[#FF8B37]/10 text-[#FF8B37]";
          default:
            return "bg-[#DFE3FA]/10 text-[#DFE3FA]";
        }
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
        <div className="min-h-screen bg-white-custom dark:bg-dark-2">
            <GoBackButtonHome />
            {/* // Info Status  */}
            <div className="flex justify-center md:mt-10">
                <div className="w-3/4 h-24 flex justify-around items-center bg-white dark:bg-strong-blue rounded-lg">
                    <p className="text-medium-gray dark:text-white font-bold">Status</p>
                    <div className="flex items-center justify-center gap-2"> 
                        <span className={`inline-flex items-center justify-center w-24 h-10 gap-2 text-sm font-bold px-3 py-1 rounded-md transition ${getStatusBadgeClasses(invoice.status)}`}>
                          <span className="w-2 h-2 rounded-full bg-current"></span>
                          {invoice.status}
                        </span>
                    </div>
                    <div className="hidden items-center gap-4 md:flex">
                        <button
                            aria-label="Edit Invoice"
                            className="w-16 h-12 text-purple dark:text-white bg-card-gray dark:bg-light-blue rounded-3xl cursor-pointer hover:bg-white hover:text-[#7E88C3] transition"
                            onClick={handleEditClick}
                        >
                            Edit
                        </button>
                        <button className="w-20 h-12 text-white bg-[#EC5757] rounded-3xl cursor-pointer hover:bg-[#FF9797] transition" onClick={handleDeleteClick}>Delete</button>
                        <button className="w-36 h-12 text-white bg-[#7C5DFA] rounded-3xl cursor-pointer hover:bg-[#9277FF] transition" onClick={() => togglePaid(id!)}>
                            {isPaid ? "Mark as Pending" : "Mark as Paid"}
                        </button>
                    </div>
                </div>
            </div>
            {/* Invoice Main Info */}
            <div className="mt-4 flex justify-center">
                <div className="w-3/4 mt-6 p-6 bg-white dark:bg-strong-blue rounded-lg md:grid md:grid-cols-4 md:grid-rows-3 md:gap-6 ">
                    {/* Invoice ID */}
                    <div className="md:content-center">
                        <p className="text-dark-1 dark:text-white font-bold">
                        <span className="text-purple dark:text-purple">
                            #
                        </span>
                        {invoice.id}
                        </p>
                        <p className="text-purple dark:text-light-gray font-medium">{invoice.description}</p>
                    </div>
                    {/* Sender Address */}
                    <div className="flex justify-between md:grid md:col-start-5 md:content-center md:justify-center">
                        <div>
                            <p className="text-sm text-purple dark:text-light-gray font-medium">{invoice.senderAddress.street}</p>
                            <p className="text-sm text-purple dark:text-light-gray font-medium">{invoice.senderAddress.city}</p>
                            <p className="text-sm text-purple dark:text-light-gray font-medium">{invoice.senderAddress.postCode}</p>
                            <p className="text-sm text-purple dark:text-light-gray font-medium">{invoice.senderAddress.country}</p>
                        </div>
                    </div>
                    {/* Invoice Date, Payment Due, Send to, Bill to*/}
                    <div className="flex justify-between mt-4 md:col-start-1 md:col-span-2 md:row-start-2">
                        <div className="flex flex-col gap-2">
                            <p className="text-sm text-purple dark:text-light-gray font-medium">Invoice Date</p>
                            <p className="text-sm text-dark-1 dark:text-white font-bold mb-4">{formattedDate}</p>
                            <p className="text-sm text-purple dark:text-light-gray font-medium">Payment Due</p>
                            <p className="text-sm text-dark-1 dark:text-white font-bold mb-4">{formattedPaymentDue}</p>
                            <div className="md:hidden">
                                <p className="text-sm text-purple dark:text-light-gray font-medium">Send to</p>
                                <p className="text-sm text-dark-1 dark:text-white font-bold">{invoice.clientEmail}</p>
                            </div>
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
                    <div className="w-full mt-6 bg-card-gray dark:bg-light-blue rounded md:grid md:col-start-1 md:col-end-6 md:row-start-3 ">
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
                    {/* Tablet and Desktop View Elements */}
                    <div className="hidden md:grid md:justify-items-start md:col-start-4 md:row-start-2">
                        <p className="text-sm text-purple dark:text-light-gray font-medium md:row-start-2">Send to</p>
                        <p className="text-sm text-dark-1 dark:text-white font-bold md:row-start-2">{invoice.clientEmail}</p>
                    </div>
                </div>
            </div>
            {/* // Edit, Delete, Mark as paid buttons */}
            <div className="h-30 flex justify-center items-center mt-30 px-6 py-4 space-x-4 bg-white dark:bg-strong-blue rounded-lg md:hidden">
                <button
                  aria-label="Edit Invoice"
                  className="w-16 h-12 text-purple dark:text-white bg-card-gray dark:bg-light-blue rounded-3xl cursor-pointer hover:bg-white hover:text-[#7E88C3] transition"
                  onClick={handleEditClick}
                >
                  Edit
                </button>
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