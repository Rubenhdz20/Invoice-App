import React from "react";
import { useInvoiceStore } from "../../context/InvoiceStore";
import InvoiceHeader from "../../components/invoice/InvoiceHeader";
import InvoiceCard from "../../components/invoice/InvoiceCard";


const InvoiceList = () => {
    const invoices = useInvoiceStore((state) => state.invoices);
    console.log("invoice", invoices);

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
                <div className="flex justify-center items-center h-[50vh]">
                    <p className="text-[#888EB0]">No invoices yet</p>
                    // imagen de no hay nada
                </div>
            )}
        </div>
    )
}

export default InvoiceList;