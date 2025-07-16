import React, { useState, useMemo, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import { useMediaQuery } from "../../hooks/useMediaQuery";
import { useInvoiceStore, Invoice } from "../../store/InvoiceStore";
import { formatCurrency } from "../../utils/formatCurrency";
import NotFoundInvoice from "../../components/invoice/NotFoundInvoice";
import GoBackButtonHome from "../../components/buttons/GoBackButtonHome";
import ConfirmDeleteModal from "../../components/modals/ConfirmDeleteModal";
import EditInvoice from "../forms/EditInvoice";
import dayjs from "dayjs";
import { AnimatePresence, motion } from "framer-motion";

// --- Framer Motion Variants ---
const slidePanel = {
  hidden:  { x: "-100%" },
  visible:{ x:    "0%" },
  exit:   { x: "-100%" },
};

const backdrop = {
  hidden:  { opacity: 0 },
  visible: { opacity: 0.5 },
  exit:    { opacity: 0 },
};

const InvoiceDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { user, isLoaded } = useUser();
    
    // ✅ Use user-specific functions instead of global invoices
    const getUserInvoices = useInvoiceStore((state) => state.getUserInvoices);
    const deleteInvoice = useInvoiceStore((state) => state.deleteInvoice);
    const togglePaid = useInvoiceStore((s) => s.togglePaid);
    const setCurrentUser = useInvoiceStore((s) => s.setCurrentUser);
    const currentUserId = useInvoiceStore((s) => s.currentUserId);
    
    const isTabletUp = useMediaQuery("(min-width: 768px)");
    const [isModalOpen, setModalOpen] = useState(false);
    const [isEditing,   setEditing]   = useState(false);

    // ✅ Set current user when component loads
    useEffect(() => {
        if (isLoaded && user && !currentUserId) {
            console.log('InvoiceDetail - Setting current user:', user.id);
            setCurrentUser(user.id);
        }
    }, [user, isLoaded, currentUserId, setCurrentUser]);

    // ✅ Get user's invoices and find the specific one
    const userInvoices = getUserInvoices();
    const invoice = userInvoices.find((invoice) => invoice.id === id);

    console.log('InvoiceDetail Debug:', {
        userId: user?.id,
        currentUserId,
        invoiceId: id,
        userInvoicesCount: userInvoices.length,
        foundInvoice: !!invoice
    });

    // Using useMemo for date formatting
    const formattedDate = useMemo(() => dayjs(invoice?.createdAt).format("DD MMM YYYY"), [invoice?.createdAt]);
    const formattedPaymentDue = useMemo(() => dayjs(invoice?.paymentDue).format("DD MMM YYYY"), [invoice?.paymentDue]);
    const isPaid = useMemo(() => invoice?.status === "Paid", [invoice?.status]);

    const handleDeleteClick = () => setModalOpen(true);
    const handleCancelModal = () => setModalOpen(false);
    
    const handleEditClick = () => {
        if (isTabletUp) {
            setEditing(true);
        } else {
            navigate(`/edit-invoice/${id}`);
        }
    };

    const handleConfirmDelete = () => {
        try {
            console.log('InvoiceDetail - Deleting invoice:', id);
            deleteInvoice(id!);
            setModalOpen(false);
            console.log('InvoiceDetail - Invoice deleted, navigating to /invoices');
            navigate("/invoices", { replace: true }); // ✅ Navigate to invoices instead of "/"
        } catch (error) {
            console.error('InvoiceDetail - Error deleting invoice:', error);
            alert(`Error deleting invoice: ${error}`);
        }
    };

    const getStatusBadgeClasses = (status: string) => {
        switch (status) {
          case "Paid":
            return "bg-[#33D69F]/10 text-[#33D69F]";
          case "Pending":
            return "bg-[#FF8B37]/10 text-[#FF8B37]";
          default: // "Draft" or any other status
            return "bg-[#DFE3FA]/10 text-[#DFE3FA] dark:bg-gray-700/10 dark:text-gray-400";
        }
    };

    // Show loading while Clerk initializes
    if (!isLoaded) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-white-custom dark:bg-dark-2">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"></div>
            </div>
        );
    }

    // --- Handle Invoice Not Found ---
    if (!invoice) {
        return (
            <div className="min-h-screen bg-white-custom dark:bg-dark-2">
                <GoBackButtonHome />
                <div className="flex flex-col items-center justify-center pt-20">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Invoice not found</h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                        The invoice you're looking for doesn't exist or you don't have permission to view it.
                    </p>
                    <button 
                        onClick={() => navigate('/invoices')}
                        className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
                    >
                        Back to Invoices
                    </button>
                </div>
            </div>
        );
    }

    // --- Main Component Render ---
    return (
        <div className="min-h-screen bg-white-custom dark:bg-dark-2 pb-24 md:pb-0"> 
            <GoBackButtonHome />
            {/* --- Info Status Section (Consolidated) --- */}
            <div className="flex justify-center mt-4 md:mt-10">
                <div className="w-full max-w-[730px] p-4 md:p-6 flex flex-col md:flex-row items-center justify-between bg-white dark:bg-strong-blue rounded-lg shadow-sm">
                    {/* Status Text and Badge */}
                    <div className="flex items-center justify-between w-full md:w-auto md:mb-0">
                        <p className="text-medium-gray dark:text-white font-bold mr-4">Status</p>
                        <span className={`inline-flex items-center justify-center w-24 h-10 gap-2 text-sm font-bold px-3 py-1 rounded-md transition ${getStatusBadgeClasses(invoice.status)}`}>
                            <span className="w-2 h-2 rounded-full bg-current"></span>
                            {invoice.status}
                        </span>
                    </div>

                    {/* Action Buttons (Always rendered, layout adjusted by parent flex) */}
                    <div className="hidden md:flex items-center gap-2 md:gap-4">
                        <button
                            aria-label="Edit Invoice"
                            className="px-4 py-2 text-purple dark:text-white bg-card-gray dark:bg-light-blue rounded-3xl cursor-pointer hover:bg-white hover:text-[#7E88C3] transition min-w-[64px]"
                            onClick={handleEditClick}
                        >
                            Edit
                        </button>
                        <button
                            className="px-4 py-2 text-white bg-[#EC5757] rounded-3xl cursor-pointer hover:bg-[#FF9797] transition min-w-[80px]"
                            onClick={handleDeleteClick}
                        >
                            Delete
                        </button>
                        <button
                            className="px-4 py-2 text-white bg-[#7C5DFA] rounded-3xl cursor-pointer hover:bg-[#9277FF] transition min-w-[128px]"
                            onClick={() => togglePaid(id!)}
                        >
                            {isPaid ? "Mark as Pending" : "Mark as Paid"}
                        </button>
                    </div>
                </div>
            </div>

            {/* --- Invoice Main Info (Consolidated) --- */}
            <div className="mt-4 flex justify-center">
                <div className="w-full max-w-[730px] mt-6 p-6 bg-white dark:bg-strong-blue rounded-lg shadow-sm
                  md:grid md:grid-cols-4 md:grid-rows-[auto_auto_1fr] md:gap-5 md:mb-15 md:mt-7">
                    {/* Invoice ID & Description */}
                    <div className="md:col-span-2 md:row-span-1 md:flex md:flex-col md:justify-start">
                        <p className="text-dark-1 dark:text-white font-bold mb-1">
                            <span className="text-purple dark:text-purple">#</span>
                            {invoice.id}
                        </p>
                        <p className="text-purple dark:text-light-gray font-medium">{invoice.description}</p>
                    </div>
                    {/* Sender Address */}
                    <div className="mt-6 md:mt-0 md:col-span-2 md:row-span-1 md:text-right">
                        <p className="text-sm text-purple dark:text-light-gray font-medium">{invoice.senderAddress.street}</p>
                        <p className="text-sm text-purple dark:text-light-gray font-medium">{invoice.senderAddress.city}</p>
                        <p className="text-sm text-purple dark:text-light-gray font-medium">{invoice.senderAddress.postCode}</p>
                        <p className="text-sm text-purple dark:text-light-gray font-medium">{invoice.senderAddress.country}</p>
                    </div>
                    {/* Invoice Date, Payment Due, Bill To, Send To */}
                    <div className="mt-6 md:mt-0 md:col-span-2 md:row-start-2 flex flex-col md:flex-row justify-between">
                        <div className="flex flex-col gap-2">
                            <p className="text-sm text-purple dark:text-light-gray font-medium">Invoice Date</p>
                            <p className="text-sm text-dark-1 dark:text-white font-bold">{formattedDate}</p>
                            <p className="mt-8 text-sm text-purple dark:text-light-gray font-medium">Payment Due</p>
                            <p className="text-sm text-dark-1 dark:text-white font-bold">{formattedPaymentDue}</p>
                            {/* "Send to" email for mobile is placed here, hidden on md and up */}
                            <div className="mt-8 md:hidden">
                                <p className="text-sm text-purple dark:text-light-gray font-medium">Send to</p>
                                <p className="text-sm text-dark-1 dark:text-white font-bold">{invoice.clientEmail}</p>
                            </div>
                        </div>
                        <div className="flex flex-col mt-6 md:mt-0">
                            <p className="text-sm text-purple dark:text-light-gray font-medium mb-2 ">Bill To</p>
                            <p className="text-sm text-dark-1 dark:text-white font-bold mb-2">{invoice.clientName}</p>
                            <p className="text-sm text-purple dark:text-light-gray font-medium">{invoice.clientAddress.street}</p>
                            <p className="text-sm text-purple dark:text-light-gray font-medium">{invoice.clientAddress.city}</p>
                            <p className="text-sm text-purple dark:text-light-gray font-medium">{invoice.clientAddress.postCode}</p>
                            <p className="text-sm text-purple dark:text-light-gray font-medium">{invoice.clientAddress.country}</p>
                        </div>
                    </div>
                    {/* "Send to" email for Tablet/Desktop - visible only on md and up */}
                    <div className="hidden md:block md:col-span-2 md:row-start-2 md:text-right md:pt-3">
                        <p className="text-sm text-purple dark:text-light-gray font-medium">Send to</p>
                        <p className="text-sm text-dark-1 dark:text-white font-bold">{invoice.clientEmail}</p>
                    </div>
                    {/* --- Invoice Items and Prices Section (Consolidated) --- */}
                    <div className="w-full mt-6 bg-card-gray dark:bg-light-blue rounded
                                md:col-span-4 md:row-start-3 md:mt-5">
                        {/* Tablet/Desktop Headers - only visible on md and up */}
                        <div className="hidden md:grid md:grid-cols-4 px-6 pt-6 text-purple dark:text-strong-gray font-bold">
                            <p>Item Name</p>
                            <p className="text-right">QTY.</p>
                            <p className="text-right">Price</p>
                            <p className="text-right">Total</p>
                        </div>

                        {/* Items List - single map, internal elements hide/show as needed */}
                        {invoice.items.map((item, index) => (
                            <div key={index} className="flex justify-between items-center p-4 md:p-6 md:grid md:grid-cols-4">
                                {/* Mobile Item details */}
                                <div className="flex flex-col md:contents">
                                    <p className="text-dark-1 dark:text-white font-bold md:col-span-1">{item.name}</p>
                                    <p className="text-purple dark:text-strong-gray font-bold md:hidden">
                                        {formatCurrency(item.quantity)} x {formatCurrency(item.price)}
                                    </p>
                                    {/* Tablet/Desktop individual item details - hidden on mobile */}
                                    <p className="hidden md:block text-purple dark:text-strong-gray font-bold md:col-span-1 md:text-right">
                                        {item.quantity}
                                    </p>
                                    <p className="hidden md:block text-dark-1 dark:text-white font-bold md:col-span-1 md:text-right">
                                        {formatCurrency(item.price)}
                                    </p>
                                    <p className="hidden md:block text-dark-1 dark:text-white font-bold md:col-span-1 md:text-right">
                                        {formatCurrency(item.total)}
                                    </p>
                                </div>
                            </div>
                        ))}

                        {/* Invoice Total */}
                        <div className="w-full flex items-center justify-between bg-total-gray dark:bg-dark-1 p-5 rounded-b-lg">
                            <p className="text-sm font-bold text-white pl-1 md:pl-6">Amount Due</p>
                            <p className="text-white font-bold text-2xl pr-1 md:pr-6">{formatCurrency(invoice.total)}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- Mobile Fixed Footer Buttons --- */}
            <div className="fixed bottom-0 left-0 right-0 h-20 flex items-center justify-center px-6 py-4 space-x-4 bg-white dark:bg-strong-blue shadow-lg md:hidden">
                <button
                    aria-label="Edit Invoice"
                    className="px-4 py-2 text-purple dark:text-white bg-card-gray dark:bg-light-blue rounded-3xl cursor-pointer hover:bg-white hover:text-[#7E88C3] transition"
                    onClick={handleEditClick}
                >
                    Edit
                </button>
                <button
                    className="px-4 py-2 text-white bg-[#EC5757] rounded-3xl cursor-pointer hover:bg-[#FF9797] transition"
                    onClick={handleDeleteClick}
                >
                    Delete
                </button>
                <button
                    className="px-4 py-2 text-white bg-[#7C5DFA] rounded-3xl cursor-pointer hover:bg-[#9277FF] transition"
                    onClick={() => togglePaid(id!)}
                >
                    {isPaid ? "Mark as Pending" : "Mark as Paid"}
                </button>
            </div>

            {/* --- Modals and Overlays --- */}
            <ConfirmDeleteModal
                invoiceId={id!}
                isOpen={isModalOpen}
                onCancel={handleCancelModal}
                onConfirm={handleConfirmDelete}
            />

            {/* --- Slide-in Edit Panel (Tablet+ only) --- */}
            <AnimatePresence>
                {isEditing && isTabletUp && (
                    <>
                        <motion.div
                            key="edit-backdrop"
                            className="fixed inset-0 bg-black dark:bg-black/60 z-10"
                            variants={backdrop}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            transition={{ duration: 0.2 }}
                            onClick={() => setEditing(false)}
                        />
                        <motion.div
                            key="edit-panel"
                            className="fixed inset-y-0 left-0 w-full max-w-md overflow-auto bg-white dark:bg-dark-2 z-20"
                            variants={slidePanel}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            transition={{ type: "tween", duration: 0.25 }}
                        >
                            <EditInvoice
                                onCancel={() => setEditing(false)}
                                onSave={() => setEditing(false)}
                            />
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}

export default InvoiceDetail;