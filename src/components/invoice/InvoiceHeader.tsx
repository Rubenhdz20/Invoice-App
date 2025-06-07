import React from "react";
import NewInvoiceButton from "../buttons/NewInvoiceButton";
import FilterDropdown from "./FilterDropdown";

type InvoiceHeaderProps = {
    invoiceCount: number;   
};

const InvoiceHeader: React.FC<InvoiceHeaderProps> = ({ invoiceCount }) => {
    return (
        <div className="flex justify-between items-center p-6 bg-white-custom dark:bg-dark-2 dark:text-white-custom">
            <div>
                <h1 className="text-2xl font-bold text-dark-1 dark:text-white">Invoices</h1>
                <p className="text-strong-gray dark:text-white-custom">
                    <span className="inline md:hidden">{invoiceCount} invoices</span>
                    <span className="hidden md:inline">
                        There are {invoiceCount} total invoices
                    </span>
                </p>
            </div>
            <FilterDropdown />
            <NewInvoiceButton />
        </div>
    );
};

export default InvoiceHeader;