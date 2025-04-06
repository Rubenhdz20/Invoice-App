import React from "react";
import { useInvoiceStore } from "../../context/InvoiceStore";
import InvoiceHeader from "../../components/invoice/InvoiceHeader";
import InvoiceCard from "../../components/invoice/InvoiceCard";
import EmptyInvoices from "../../components/invoice/EmptyInvoices";

const InvoiceList = () => {
    const invoices = useInvoiceStore((state) => state.invoices);

    return (
        <div className="bg-[#141625]">
            <InvoiceHeader invoiceCount={invoices.length}/>
            {invoices.length > 0 ?(
                <div className="grid grid-cols-1 gap-4 p-6">
                    {invoices.map((invoice) => (
                        <InvoiceCard key={invoice.id} invoice={invoice} />
                    ))}
                </div>
            ) : (
                <EmptyInvoices />
            )}
        </div>
    )
}

export default InvoiceList;