import React, { useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import { useInvoiceStore } from "../../store/InvoiceStore";
import InvoiceHeader from "../../components/invoice/InvoiceHeader";
import InvoiceCard from "../../components/invoice/InvoiceCard";
import EmptyInvoices from "../../components/invoice/EmptyInvoices";

const InvoiceList = () => {
    const { user, isLoaded } = useUser();
    const switchUser = useInvoiceStore((state) => state.switchUser);
    const clearCurrentUser = useInvoiceStore((state) => state.clearCurrentUser);
    const getUserInvoices = useInvoiceStore((state) => state.getUserInvoices);
    const initializeUserInvoices = useInvoiceStore((state) => state.initializeUserInvoices);
    const filters = useInvoiceStore((state) => state.filters);
    const currentUserId = useInvoiceStore((state) => state.currentUserId);
    const getAllUsers = useInvoiceStore((state) => state.getAllUsers);

    // ✅ Handle user switching/login
    useEffect(() => {
        if (isLoaded) {
            if (user) {
                // User is logged in
                console.log('InvoiceList - User logged in:', user.id);
                console.log('InvoiceList - Current user in store:', currentUserId);
                
                if (currentUserId !== user.id) {
                    console.log('InvoiceList - Switching to user:', user.id);
                    switchUser(user.id);
                    initializeUserInvoices(user.id);
                }
                
                // Debug: Show all users
                console.log('📊 All users in system:', getAllUsers());
            } else {
                // User is logged out
                console.log('InvoiceList - User logged out, clearing store');
                clearCurrentUser();
            }
        }
    }, [user, isLoaded, currentUserId, switchUser, clearCurrentUser, initializeUserInvoices, getAllUsers]);

    // Show loading while Clerk is initializing
    if (!isLoaded) {
        return (
            <div className="min-h-screen bg-white-custom dark:bg-dark-2 flex items-center justify-center">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"></div>
            </div>
        );
    }

    // If no user is logged in, this shouldn't happen due to protected routes
    if (!user) {
        return (
            <div className="min-h-screen bg-white-custom dark:bg-dark-2 flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                        Please sign in
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400">
                        You need to be logged in to view invoices
                    </p>
                </div>
            </div>
        );
    }

    // Get user-specific invoices
    const userInvoices = getUserInvoices();

    // Apply filters to user's invoices
    const filtered =
        filters.includes("All") || filters.length === 0
            ? userInvoices
            : userInvoices.filter((inv) => filters.includes(inv.status));

    return (
        <div className="min-h-screen bg-white-custom dark:bg-dark-2">
            <div className="px-4 md:px-8 lg:px-16 mx-auto max-w-screen-sm md:max-w-screen-md lg:max-w-screen-lg">            
                <InvoiceHeader invoiceCount={filtered.length}/>
                {filtered.length > 0 ? (
                    <div className="h-full grid grid-cols-1 gap-4 p-6">
                        {filtered.map((invoice) => (
                            <InvoiceCard key={invoice.id} invoice={invoice} />
                        ))}
                    </div>
                ) : (
                    <EmptyInvoices />
                )}
            </div>
        </div>
    );
};

export default InvoiceList;