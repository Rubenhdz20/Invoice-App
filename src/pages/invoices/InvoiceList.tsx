import React from "react";
import { useInvoiceStore } from "../../store/InvoiceStore";
import InvoiceHeader from "../../components/invoice/InvoiceHeader";
import InvoiceCard from "../../components/invoice/InvoiceCard";
import EmptyInvoices from "../../components/invoice/EmptyInvoices";

const InvoiceList = () => {
    const invoices = useInvoiceStore((state) => state.invoices);
    const filters = useInvoiceStore((s) => s.filters);

    const filtered =
    filters.includes("All") || filters.length === 0
      ? invoices
      : invoices.filter((inv) => filters.includes(inv.status));

    return (
        <div className="min-h-screen bg-white-custom dark:bg-dark-2">
            <div className="px-4 md:px-8 lg:px-16 mx-auto max-w-screen-sm md:max-w-screen-md lg:max-w-screen-lg">
                <InvoiceHeader invoiceCount={filtered.length}/>
                {filtered.length > 0 ?(
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
    )
}

export default InvoiceList;