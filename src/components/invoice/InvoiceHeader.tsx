import React from "react";
import NewInvoiceButton from "../buttons/NewInvoiceButton";
import FilterDropdown from "./FilterDropdown";

type InvoiceHeaderProps = {
    invoiceCount: number;   
};

const InvoiceHeader: React.FC<InvoiceHeaderProps> = ({ invoiceCount }) => {
    return (
        <div className="flex justify-between items-center p-6 bg-[#141625] text-white">
            <div>
                <h1 className="text-2xl font-bold text-white">Invoices</h1>
                <p className="text-[#DFE3FA]">{invoiceCount} invoices</p>
            </div>
            <FilterDropdown />
            <NewInvoiceButton />
        </div>
    );
};

export default InvoiceHeader;